import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { VehicleResponseDto } from "./vehicle.response.dto";
import { ValidateNested } from "class-validator";

export class PagedVehicleResponseDto {
    @ApiProperty({
        description: "The list of vehicles",
        type: VehicleResponseDto
    })
    @Type(() => VehicleResponseDto)
    @Expose()
    @ValidateNested({ each: true })
    result: VehicleResponseDto[];

    @ApiProperty({
        description: "The total number of vehicles",
        type: Number,
        example: 10
    })
    @Expose()
    count: number;

    @ApiProperty({
        description: "The current page",
        type: Number,
        example: 1
    })
    @Expose()
    page: number;

    @ApiProperty({
        description: "The number of vehicles per page",
        type: Number,
        example: 10
    })
    @Expose()
    limit: number;
}
