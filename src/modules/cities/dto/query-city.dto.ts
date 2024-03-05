import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import { CityQueryOrderBy, CityQueryOrderDirection } from "../cities.enums";
import { Transform } from "class-transformer";

export class QueryCityDto {
    @ApiProperty({
        description: "Order by a specific field",
        type: String,
        example: CityQueryOrderBy.CREATED,
        required: false
    })
    @IsEnum(CityQueryOrderBy)
    @IsOptional()
    orderBy?: CityQueryOrderBy;

    @ApiProperty({
        description: "Direction to order by",
        type: String,
        example: CityQueryOrderDirection.ASC,
        required: false
    })
    @IsEnum(CityQueryOrderDirection)
    @IsOptional()
    orderDirection?: CityQueryOrderDirection;
    
    @ApiProperty({
        description: "The district's name",
        required: false,
        type: String
    })  
    @IsOptional()
    @IsString()
    name: string;

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
