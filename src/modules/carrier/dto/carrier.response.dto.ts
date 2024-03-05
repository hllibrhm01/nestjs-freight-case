import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CityOneResponseDto } from "src/modules/cities/dto/city-one-response.dto";
import { DistrictOneResponseDto } from "src/modules/districts/dto/district-one-response.dto";
import { UserOneResponseDto } from "src/modules/users/dto/user-one-response.dto";
import { VehicleOneResponseDto } from "src/modules/vehicles/dto/vehicle-one-response.dto";

export class CarrierResponseDto {
    @ApiProperty({
        description: "Company name",
        type: String
    })
    @Expose()
    companyName: string;

    @ApiProperty({
        description: "Phone number",
        type: String
    })
    @Expose()
    phoneNumber: string;

    @ApiProperty({
        description: "User id",
        type: Number
    })
    @Expose()
    userId: number;

    @ApiProperty({
        description: "Vehicle id",
        type: Number
    })
    @Expose()
    vehicleId: number;

    @ApiProperty({
        description: "Vehicle plate number",
        type: String
    })
    @Expose()
    vehiclePlateNumber: string;

    @ApiProperty({
        description: "City id",
        type: Number
    })
    @Expose()
    cityId: number;

    @ApiProperty({
        description: "District id",
        type: Number
    })
    @Expose()
    districtId: number;

    @ApiProperty({
        description: "Discount rate",
        type: Number
    })
    @Expose()
    discountRate: number;

    @ApiProperty({
        description: "Promotional offers",
        type: String
    })
    @Expose()
    promotionalOffers: string;

    @ApiProperty({
        description: "The city",
        type: CityOneResponseDto
      })
      @Expose()
      @Type(() => CityOneResponseDto)
      @ValidateNested()
      city: CityOneResponseDto;

    @ApiProperty({
        description: "The district",
        type: DistrictOneResponseDto
      })
    @Expose()
    @Type(() => DistrictOneResponseDto)
    @ValidateNested()
    district: DistrictOneResponseDto;   

    @ApiProperty({
        description: "The user id of the carrier",
        type: UserOneResponseDto
    })
    @Expose()
    @Type(() => UserOneResponseDto)
    @ValidateNested()
    user: UserOneResponseDto;

    @ApiProperty({
        description: "The vehicle id of the carrier",
        type: VehicleOneResponseDto
    })
    @Expose()
    @Type(() => VehicleOneResponseDto)
    @ValidateNested()
    vehicle: VehicleOneResponseDto;
}
