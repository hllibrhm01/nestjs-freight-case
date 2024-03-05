import { Expose, Type } from "class-transformer";
import { CityResponseDto } from "./city.response.dto";

export class CityOneResponseDto {
  @Expose()
  @Type(() => CityResponseDto)
  result: CityResponseDto;
}
