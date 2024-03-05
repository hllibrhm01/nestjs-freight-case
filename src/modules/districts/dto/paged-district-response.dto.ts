import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { DistrictResponseDto } from "./district.response.dto";
import { ValidateNested } from "class-validator";

export class PagedDistrictResponseDto {
    @ApiProperty({
        description: "The list of districts",
        type: DistrictResponseDto
    })
    @Type(() => DistrictResponseDto)
    @Expose()
    @ValidateNested({ each: true })
    result: DistrictResponseDto[];

    @ApiProperty({
        description: "The total number",
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
        description: "The number of per page",
        type: Number,
        example: 10
      })
      @Expose()
      limit: number;
}
