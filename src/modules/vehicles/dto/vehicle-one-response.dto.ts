import { Expose, Type } from "class-transformer";
import { VehicleResponseDto } from "./vehicle.response.dto";

export class VehicleOneResponseDto {
    @Expose()
    @Type(() => VehicleResponseDto)
    result: VehicleResponseDto;
}
