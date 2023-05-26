import { IsArray, IsDefined, IsEnum, IsNumber, Max, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { DroneModel, DroneState } from "../enums";
import { MedicationDTO } from "./Medication.dto";

export class DroneDTO {
  @IsDefined()
  @MaxLength(100)
  @MinLength(2)
  serialNumber: string;

  @IsEnum(DroneModel)
  model: DroneModel;

  @IsDefined()
  @IsNumber()
  @Max(500)
  weightLimitGrams: number;

  @IsDefined()
  @IsNumber()
  @Max(100)
  batteryCapacity: number;

  @IsEnum(DroneState)
  state: DroneState;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDTO)
  load: MedicationDTO[];
}
