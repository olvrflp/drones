import { Body, Controller, Get, NotImplementedException, Param, Post, Put } from "@nestjs/common";
import { DroneDTO } from "../DTOs/Drone.dto";
import { MedicationDTO } from "../DTOs/Medication.dto";

@Controller("/drone")
export class DroneController {

  @Get()
  async availableDrones(): Promise<DroneDTO[]> {
    throw new NotImplementedException();
  }

  @Get(":serial")
  async getDrone(@Param(":serial") droneSerialNo: String): Promise<DroneDTO>  {
    throw new NotImplementedException();
  }

  @Get(":serial/load")
  async getDroneLoad(@Param(":serial") droneSerialNo: String): Promise<MedicationDTO[]>  {
    throw new NotImplementedException();
  }


  @Get(":serial/batteryLevel")
  async getDroneBatteryLevel(@Param(":serial") droneSerialNo: String) {
    throw new NotImplementedException();
  }

  @Post()
  async registerDrone(@Body() drone: DroneDTO) {
    throw new NotImplementedException();
  }

  @Put(":serial/load")
  async loadDrone(
    @Param(":serial") droneSerialNo: String,
    @Body() medications: MedicationDTO[]
  ) {
    throw new NotImplementedException();
  }
}
