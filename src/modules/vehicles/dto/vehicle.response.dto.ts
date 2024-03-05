import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class VehicleResponseDto {
    @ApiProperty({
        description: "The brand of the vehicle",
        type: String
    })
    @Expose()
    brand: string;
    
    @ApiProperty({
        description: "The model of the vehicle",
        type: String
    })
    @Expose()
    model: string;

    @ApiProperty({
        description: "The vehicle color",
        type: String
    })
    @Expose()
    color: string;
    
    @ApiProperty({
        description: "The year of the vehicle",
        type: Number
    })
    @Expose()
    year: number;

    @ApiProperty({
        description: "The vehicle's type",
        type: String
    })
    @Expose()
    type: string;

    @ApiProperty({
        description: "The vehicle status",
        type: Boolean
    })
    @Expose()
    status: boolean;
}
