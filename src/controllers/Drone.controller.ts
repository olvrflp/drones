import { Body, Controller, Get, NotImplementedException, Param, ParseArrayPipe, Post, Put } from "@nestjs/common";
import { DroneService } from "../services/Drone.service";
import { DroneDTO } from "../DTOs/Drone.dto";
import { MedicationDTO } from "../DTOs/Medication.dto";

@Controller("/drone")
export class DroneController {

  constructor(private readonly droneService: DroneService) {}

  @Get()
  async availableDrones(): Promise<DroneDTO[]> {
    return this.droneService.getAvailableDrones();
  }

  @Get(":serial")
  async getDrone(@Param("serial") droneSerialNo: string): Promise<DroneDTO>  {
    return this.droneService.getDroneBySerial(droneSerialNo);
  }

  @Get(":serial/load")
  async getDroneLoad(@Param("serial") droneSerialNo: string): Promise<MedicationDTO[]>  {
    return this.droneService.getDroneLoad(droneSerialNo);
  }


  @Get(":serial/batteryLevel")
  async getDroneBatteryLevel(@Param("serial") droneSerialNo: string): Promise<number> {
    return this.droneService.getDroneBatteryCapacity(droneSerialNo);
  }

  @Post()
  async registerDrone(@Body() drone: DroneDTO) {
    return this.droneService.registerDrone(drone);
  }

  @Put(":serial/load")
  async loadDrone(
    @Param("serial") droneSerialNo: string,
    @Body(new ParseArrayPipe({ items: MedicationDTO })) medications: MedicationDTO[]
  ) {
    return this.droneService.loadDrone(droneSerialNo, medications);
  }
}
