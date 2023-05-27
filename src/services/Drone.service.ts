import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import Redis from "ioredis";
import { droneFleet } from "../seeds/drones.seed";
import { DroneDTO } from "../DTOs/Drone.dto";
import { MedicationDTO } from "../DTOs/Medication.dto";
import { DroneState } from "../enums";

@Injectable()
export class DroneService implements OnModuleInit {

  onModuleInit() {
    droneFleet.forEach(drone => this.registerDrone(drone));
  }

  private readonly MINIMUM_USABLE_BATTERY = 25;

  constructor(@InjectRedis() private readonly redisClient: Redis) { }

  async getAvailableDrones(): Promise<DroneDTO[]> {
    const drones = await this.redisClient.mget(await this.redisClient.keys("*"))
    return drones
      .map(value => plainToClass(DroneDTO, JSON.parse(value)))
      .filter(drone => drone?.state === DroneState.IDLE)
  }

  async getDroneBySerial(serial: string): Promise<DroneDTO> {
    const drone = await this.redisClient.get(serial);
    if (!drone) {
      throw new NotFoundException();
    }

    return plainToClass(DroneDTO, JSON.parse(drone));
  }

  async registerDrone(drone: DroneDTO) {
    return this.redisClient
      .set(drone.serialNumber, JSON.stringify(drone))
      .then(() => drone)
      .catch(() => { throw new InternalServerErrorException() });
  }

  async getDroneLoad(serial: string): Promise<MedicationDTO[]> {
    return (await this.getDroneBySerial(serial)).load;
  }

  async getDroneBatteryCapacity(serial: string): Promise<any> {
    const { batteryCapacity } = (await this.getDroneBySerial(serial));
    return ({ batteryCapacity });
  }

  async loadDrone(droneSerial: string, load: MedicationDTO[]) {
    const droneToLoad = await this.getDroneBySerial(droneSerial);

    if (!droneToLoad) {
      throw new BadRequestException({ message: "Drone not found" });
    }

    if (droneToLoad.batteryCapacity < this.MINIMUM_USABLE_BATTERY) {
      throw new ConflictException({ message: "can't use the drone since is low on battery." });
    }

    const loadWeight = load.reduce((acc, curr ) => acc + curr.weight, 0);
    if (droneToLoad.weightLimitGrams < loadWeight) {
      throw new ConflictException({ message: "too much weight for the drone." })
    }

    return this.registerDrone({ ...droneToLoad, load })
  }
}
