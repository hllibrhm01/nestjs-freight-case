import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CityOneResponseDto } from "src/modules/cities/dto/city-one-response.dto";

export class DistrictResponseDto {
    @ApiProperty({
        description: "The name of the district",
        type: String
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: "The city id of the district",
        type: Number
    })
    @Expose()
    cityId: number;

    @ApiProperty({
        description: "The city",
        type: CityOneResponseDto
    })
    @Expose()
    @Type(() => CityOneResponseDto)
    @ValidateNested()
    city: CityOneResponseDto;
}
