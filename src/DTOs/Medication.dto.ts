import { IsDefined, IsNumber, IsUrl, Matches, MaxLength } from "class-validator";

export class MedicationDTO {
  @IsDefined()
  @Matches(/^[a-zA-Z0-9-_]+$/i)
  name: string;

  @IsDefined()
  @IsNumber()
  weight: number;

  @IsDefined()
  @Matches(/^[A-Z0-9_]+$/i)
  code: string;

  @IsUrl()
  image: string;
}
