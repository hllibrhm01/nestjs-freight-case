import { Expose, Type } from "class-transformer";
import { DistrictResponseDto } from "./district.response.dto";

export class DistrictOneResponseDto {
  @Expose()
  @Type(() => DistrictResponseDto)
  result: DistrictResponseDto;
}
