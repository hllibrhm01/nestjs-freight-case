import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDistrictDto {
    @ApiProperty({
        description: "The city id of the district",
        type: Number,
        example: 1,
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    cityId: number;

    @ApiProperty({
        description: "The name of the district",
        type: String,
        example: "Kadikoy",
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}
