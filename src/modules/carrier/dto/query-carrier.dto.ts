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
import { CarrierQueryOrderBy, CarrierQueryOrderDirection } from "../carrier.enums";

export class QueryCarrierDto {
  @ApiProperty({
    description: "Order by a specific field",
    type: String,
    example: CarrierQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(CarrierQueryOrderBy)
  @IsOptional()
  orderBy?: CarrierQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by",
    type: String,
    example: CarrierQueryOrderDirection.ASC,
    required: false
  })
  @IsEnum(CarrierQueryOrderDirection)
  @IsOptional()
  orderDirection?: CarrierQueryOrderDirection;

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
    description: "The city id of the carrier",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  cityId: number;

  @ApiProperty({
    description: "The district id of the carrier",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  districtId: number;

  @ApiProperty({
    description: "The user id of the carrier",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: "The vehicle id of the carrier",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  vehicleId: number;

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
