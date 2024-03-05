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
import { VehicleQueryOrderBy, VehicleQueryOrderDirection } from "../vehicles.enums";

export class QueryVehicleDto {
  @ApiProperty({
    description: "Order by a specific field",
    type: String,
    example: VehicleQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(VehicleQueryOrderBy)
  @IsOptional()
  orderBy?: VehicleQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by",
    type: String,
    example: VehicleQueryOrderDirection.ASC,
    required: false
  })
  @IsEnum(VehicleQueryOrderDirection)
  @IsOptional()
  orderDirection?: VehicleQueryOrderDirection;

  @ApiProperty({
    description: "The vehicle's brand",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty({
    description: "The vehicle's model",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  model: string;

  @ApiProperty({
    description: "The vehicle's year",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

    @ApiProperty({
        description: "The vehicle's color",
        required: false,
        type: String
    })  
    @IsOptional()
    @IsString()
    color: string;

    @ApiProperty({
        description: "The vehicle's type",
        required: false,
        type: String
    })
    @IsOptional()
    @IsString()
    type: string;

  @ApiProperty({
    description: "The vehicle's is active",
    required: false,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;

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
