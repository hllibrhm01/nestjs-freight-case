import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
  } from "class-validator";
import { FavoriteQueryOrderBy, FavoriteQueryOrderDirection } from "../favorite.enums";

export class QueryFavoriteDto {
    @ApiProperty({
        description: "Order by a specific field",
        type: String,
        example: FavoriteQueryOrderBy.CREATED,
        required: false
    })
    @IsEnum(FavoriteQueryOrderBy)
    @IsOptional()
    orderBy?: FavoriteQueryOrderBy;

    @ApiProperty({
        description: "Direction to order by",
        type: String,
        example: FavoriteQueryOrderDirection.ASC,
        required: false
    })
    @IsEnum(FavoriteQueryOrderDirection)
    @IsOptional()
    orderDirection?: FavoriteQueryOrderDirection;

    @ApiProperty({
        description: "The user id of the favorite",
        required: false,
        type: Number
    })
    @IsOptional()
    @IsNumber()
    userId: number;

    @ApiProperty({
        description: "The carrier id of the favorite",
        required: false,
        type: Number
    })
    @IsOptional()
    @IsNumber()
    carrierId: number;

    @ApiProperty({
        description: "Page number",
        type: "number",
        example: 1,
        default: 1,
        required: false
      })
      @Transform(({ obj, key }) => {
        return obj[key] ? parseInt(obj[key], 10) : 1;
      })
      @IsNumber()
      @Min(1)
      page: number;
    
      @ApiProperty({
        description: "The number of items per page",
        type: "number",
        example: 10,
        default: 10,
        required: false
      })
      @Transform(({ obj, key }) => {
        return obj[key] ? parseInt(obj[key], 10) : 10;
      })
      @IsNumber()
      @Min(1)
      @Max(50)
      limit: number;
}
