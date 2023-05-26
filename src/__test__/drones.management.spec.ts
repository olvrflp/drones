import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DroneController } from "../controllers/Drone.controller";
import { DroneDTO } from "../DTOs/Drone.dto";
import { DroneModel, DroneState } from "../enums";
import * as request from 'supertest';
import { droneFleet } from "../seeds/drones.seed";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { MedicationDTO } from "../DTOs/Medication.dto";

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
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DroneController],
    }).compile();

    app = moduleRef.createNestApplication();
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
        .expect({
          data: firstDrone
        })
    });

    it("test get available drones", () => {
      return request(app.getHttpServer())
        .get(`/drone`)
        .expect(200)
        .expect({
          data: droneFleet.filter(drone => drone.state === DroneState.IDLE)
        })
    });

    it("test get drone load", () => {
      const firstDrone = droneFleet[0];
      return request(app.getHttpServer())
        .get(`/drone/${firstDrone.serialNumber}/load`)
        .expect(200)
        .expect({
          data: firstDrone.load
        })
    });

    it("test get drone battery level", () => {
      const firstDrone = droneFleet[0];
      return request(app.getHttpServer())
        .get(`/drone/${firstDrone.serialNumber}/batteryLevel`)
        .expect(200)
        .expect({
          data: firstDrone.batteryCapacity
        })
    });

    it("test register a drone", () => {
      return request(app.getHttpServer())
        .post(`/drone`)
        .send(dummy)
        .expect(201)
        .expect({
          data: dummy
        })
    });

    it("test load a drone", () => {
      const availableDrone = droneFleet.find(drone => drone.state == DroneState.IDLE )
      const medications = [{
        name: "Ibuprofen 500mg x 10",
        weight: 150,
        code: "IBF_500_10",
        image: "https://www.google.com"
      }];

      return request(app.getHttpServer())
        .put(`/drone/${availableDrone.serialNumber}/load`)
        .send(medications)
        .expect(200)
        .expect({
          data: { ...availableDrone, load: medications }
        })
    });
  });

  describe("Validations for fields", () => {
    const validMed: MedicationDTO = {
      name: "Aspirina 500",
      weight: 50,
      code: "ASP500",
      image: "https://www.bayer.com/"
    };

    it("Test can't register a drone with invalid information", () => {
      const dummy = {
        serialNumber: "1",
        model: "DJI Mini",
        weightLimitGrams: "500gr",
        batteryCapacity: "150%",
        state: "Unavailable"
      };

      return request(app.getHttpServer())
        .post("/drone")
        .send(dummy)
        .expect(400)
        .expect({
          messages: validate(plainToClass(DroneDTO, dummy))
        });
    });

    it("Test can't load medication with invalid information", () => {
      const dummyMed = {
        name: "@$%&_asew",
        weight: "350g",
        code: "asb#£&",
        image: "not a link"
      };
      const drone = droneFleet.find(drone => drone.state === DroneState.IDLE);

      return request(app.getHttpServer())
        .put(`/drone/${drone.serialNumber}/load`)
        .send([dummyMed])
        .expect(400)
        .expect({
          messages: validate(plainToClass(DroneDTO, dummy))
        });
    });

    it("Test can't load a drone that is low on battery", () => {
      const lowBatteryDrone = droneFleet.find(drone => drone.batteryCapacity < 25)

      return request(app.getHttpServer())
        .put(`/drone/${lowBatteryDrone.serialNumber}/load`)
        .send([validMed])
        .expect(409)
        .expect({
          messages: "can't use the drone since is low on battery."
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
          messages: "too much weight for the drone."
        });
    });
  });
});
