import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CarrierResponseDto } from "./carrier.response.dto";
import { ValidateNested } from "class-validator";

export class PagedCarrierResponseDto {
    @ApiProperty({
        description: "The list of districts",
        type: CarrierResponseDto
    })
    @Type(() => CarrierResponseDto)
    @Expose()
    @ValidateNested({ each: true })
    result: CarrierResponseDto[];

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
