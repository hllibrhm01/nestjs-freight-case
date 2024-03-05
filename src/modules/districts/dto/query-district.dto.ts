import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import { DistrictQueryOrderBy, DistrictQueryOrderDirection } from "../districts.enums";

export class QueryDistrictDto {
    @ApiProperty({
        description: "Order by a specific field",
        type: String,
        example: DistrictQueryOrderBy.CREATED,
        required: false
    })
    @IsEnum(DistrictQueryOrderBy)
    @IsOptional()
    orderBy?: DistrictQueryOrderBy;

    @ApiProperty({
        description: "Direction to order by",
        type: String,
        example: DistrictQueryOrderDirection.ASC,
        required: false
    })
    @IsEnum(DistrictQueryOrderDirection)
    @IsOptional()
    orderDirection?: DistrictQueryOrderDirection;
    
    @ApiProperty({
        description: "The district's name",
        required: false,
        type: String
    })  
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        description: "The city id of the district",
        required: false,
        type: Number
    })
    @IsOptional()
    @IsNumber()
    cityId: number;

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
