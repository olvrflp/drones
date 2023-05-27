import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DroneDTO } from "../src/DTOs/Drone.dto";
import { DroneModel, DroneState } from "../src/enums";
import * as request from 'supertest';
import { droneFleet } from "../src/seeds/drones.seed";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { MedicationDTO } from "../src/DTOs/Medication.dto";
import { AppModule } from "../src/app.module";

describe("Drones Management Tests", () => {
  let app: INestApplication;

  const dummy: DroneDTO = {
    serialNumber: "ASD_123$·%/",
    model: DroneModel.MIDDWEIGHT,
    weightLimitGrams: 450,
    batteryCapacity: 90,
    state: DroneState.IDLE,
    load: []
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Happy Path tests", () => {
    it("test get singleDrone by serial", () => {
      const firstDrone = droneFleet[0];
      return request(app.getHttpServer())
        .get(`/drone/${firstDrone.serialNumber}`)
        .expect(200)
        .expect(firstDrone)
    });

    it("test get available drones", () => {
      const expectedDrones = droneFleet.filter(
        drone => drone.state === DroneState.IDLE && drone.serialNumber !== dummy.serialNumber
      )
      return request(app.getHttpServer())
        .get(`/drone`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expect.arrayContaining(expectedDrones))
        })
    });

    it("test get drone load", () => {
      const firstDrone = droneFleet[0];
      return request(app.getHttpServer())
        .get(`/drone/${firstDrone.serialNumber}/load`)
        .expect(200)
        .expect(firstDrone.load)
    });

    it("test get drone battery level", () => {
      const firstDrone = droneFleet[0];
      const { batteryCapacity } = firstDrone;
      request(app.getHttpServer())
        .get(`/drone/${firstDrone.serialNumber}/batteryLevel`)
        .expect(200)
        .expect({ batteryCapacity })
    });

    it("test register a drone", () => {
      return request(app.getHttpServer())
        .post(`/drone`)
        .send(dummy)
        .expect(201)
        .expect(dummy)
    });

    it("test load a drone", () => {
      const availableDrone = droneFleet.find(drone => drone.state == DroneState.IDLE )
      const medications = [{
        name: "Ibuprofen500mgx10",
        weight: 150,
        code: "IBF_500_10",
        image: "https://www.google.com"
      }];

      return request(app.getHttpServer())
        .put(`/drone/${availableDrone.serialNumber}/load`)
        .send(medications)
        .expect(200)
        .expect({ ...availableDrone, load: medications })
    });
  });

  describe("Validations for fields", () => {
    const validMed: MedicationDTO = {
      name: "Aspirina500",
      weight: 50,
      code: "ASP500",
      image: "https://www.bayer.com/"
    };

    it("Test can't register a drone with invalid information", async () => {
      const dummy = {
        serialNumber: "1",
        model: "DJI Mini",
        weightLimitGrams: "500gr",
        batteryCapacity: "150%",
        state: "Unavailable"
      };

      const errors = await validate(plainToClass(DroneDTO, dummy))
      request(app.getHttpServer())
        .post("/drone")
        .send(dummy)
        .expect(400)
        .end((err, res) => {
          expect(res.body)
          .toEqual(
            expect.objectContaining({
              message: errors.map(error => Object.values(error.constraints)).flat()
            })
          )
        });
    });

    it("Test can't load medication with invalid information", async () => {
      const dummyMed = {
        name: "@$%&_ asew",
        weight: "350g",
        code: "asb#£&",
        image: "not a link"
      };
      const drone = droneFleet.find(drone => drone.state === DroneState.IDLE);

      const errors = await validate(plainToClass(MedicationDTO, dummyMed));
      request(app.getHttpServer())
        .put(`/drone/${drone.serialNumber}/load`)
        .send([dummyMed])
        .expect(400)
        .end((_err, res) => {
          expect(res.body)
            .toEqual(expect.objectContaining({
              message: errors.map(error => Object.values(error.constraints)).flat()
            }))
        });
    });

    it("Test can't load a drone that is low on battery", () => {
      const lowBatteryDrone = droneFleet.find(drone => drone.batteryCapacity < 25)

      return request(app.getHttpServer())
        .put(`/drone/${lowBatteryDrone.serialNumber}/load`)
        .send([validMed])
        .expect(409)
        .expect({
          message: "can't use the drone since is low on battery."
        });
    });

    it("Test can't load a drone with more wight than allowed", () => {
      const drone = droneFleet.find(drone => drone.state === DroneState.IDLE);
      const newWeight = drone.weightLimitGrams + 250;
      const medications = [
        { ...validMed, weight: newWeight/2 },
        { ...validMed, weight: newWeight/2 }
      ];

      return request(app.getHttpServer())
        .put(`/drone/${drone.serialNumber}/load`)
        .send(medications)
        .expect(409)
        .expect({
          message: "too much weight for the drone."
        });
    });

    it("Test can't load a drone that is not Idle", () => {
      const drone = droneFleet.find(drone => drone.state !== DroneState.IDLE);

      return request(app.getHttpServer())
        .put(`/drone/${drone.serialNumber}/load`)
        .send([validMed])
        .expect(409)
        .expect({
          message: "The drone is not available for loads."
        });
    });
  });
});
