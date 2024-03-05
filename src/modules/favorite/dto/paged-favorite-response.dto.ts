import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { FavoriteResponseDto } from "./favorite.response.dto";
import { ValidateNested } from "class-validator";

export class PagedFavoriteResponseDto {
    @ApiProperty({
        description: "The favorites",
        type: [FavoriteResponseDto]
    })
    @Expose()
    @Type(() => FavoriteResponseDto)
    @ValidateNested({ each: true })
    result: FavoriteResponseDto[];
    
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
