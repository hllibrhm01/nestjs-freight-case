import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class CreateVehicleDto {
    @ApiProperty({
        description: "The brand of the vehicle",
        type: String,
        example: "Toyota",
        required: true
    })
    @Expose()
    brand: string;

    @ApiProperty({
        description: "The model of the vehicle",
        type: String,
        example: "Corolla",
        required: true
    })
    @Expose()
    model: string;

    @ApiProperty({
        description: "The year of the vehicle",
        type: Number,
        example: 2020,
        required: true
    })
    @Expose()
    @IsString()
    year: number;

    @ApiProperty({
        description: "The type of the vehicle",
        type: String,
        example: "Sedan",
        required: true
    })
    @Expose()
    type: string;

    @ApiProperty({
        description: "The color of the vehicle",
        type: String,
        example: "Black",
        required: true
    })
    @Expose()
    color: string;

    @ApiProperty({
        description: "The status of the vehicle",
        type: Boolean,
        example: true,
        required: true
    })
    @Expose()
    @IsBoolean()
    status: boolean;
}
