import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CityResponseDto {
    @ApiProperty({
        description: "The name of the city",
        type: String
    })
    @Expose()
    name: string;
}
