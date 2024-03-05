import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCityDto {
  @ApiProperty({
    description: "The name of the city",
    type: String,
    example: "Istanbul",
    required: true
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}
