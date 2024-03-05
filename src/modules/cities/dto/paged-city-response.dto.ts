import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CityResponseDto } from "./city.response.dto";
import { ValidateNested } from "class-validator";

export class PagedCityResponseDto {
    @ApiProperty({
        description: "The list of cities",
        type: CityResponseDto
    })
    @Type(() => CityResponseDto)
    @Expose()
    @ValidateNested({ each: true })
    result: CityResponseDto[];

    @ApiProperty({
        description: "The total number of cities",
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
        description: "The number of cities per page",
        type: Number,
        example: 10
      })
      @Expose()
      limit: number;
}
