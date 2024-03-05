import { Expose, Type } from "class-transformer";
import { CarrierResponseDto } from "./carrier.response.dto";

export class CarrierOneResponseDto {
  @Expose()
  @Type(() => CarrierResponseDto)
  result: CarrierResponseDto;
}
