import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DroneService } from "./Drone.service";

@Injectable()
export class BatteryMonitor {
  private readonly logger: Logger;
  constructor(private readonly droneService: DroneService) {
    this.logger = new Logger(BatteryMonitor.name);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkBatteryLevels() {
    const drones = await this.droneService.getAllDrones();
    drones.forEach(
      drone => this.logger.log(`The battery level for the drone ${drone.serialNumber} is ${drone.batteryCapacity}`)
    )
  }
}
