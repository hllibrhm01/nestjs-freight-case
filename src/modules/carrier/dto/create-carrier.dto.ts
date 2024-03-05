import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateCarrierDto {
    @ApiProperty({
        description: "Company name",
        type: String,
        example: "UPS",
        required: true
    })
    @Expose()
    companyName: string;

    @ApiProperty({
        description: "Phone number",
        type: String,
        example: "1234567890",
        required: true
    })
    @Expose()
    phoneNumber: string;

    @ApiProperty({
        description: "User id",
        type: Number,
        example: 1,
        required: true
    })
    @Expose()
    userId: number;

    @ApiProperty({
        description: "Vehicle id",
        type: Number,
        example: 1,
        required: true
    })
    @Expose()
    vehicleId: number;

    @ApiProperty({
        description: "Vehicle plate number",
        type: String,
        example: "34ABC123",
        required: true
    })
    @Expose()
    vehiclePlateNumber: string;

    @ApiProperty({
        description: "City id",
        type: Number,
        example: 1,
        required: true
    })
    @Expose()
    cityId: number;

    @ApiProperty({
        description: "District id",
        type: Number,
        example: 1,
        required: true
    })
    @Expose()
    districtId: number;

    @ApiProperty({
        description: "Discount rate",
        type: Number,
        example: 10,
        required: true
    })
    @Expose()
    discountRate: number;

    @ApiProperty({
        description: "Promotional offers",
        type: String,
        example: "Free shipping",
        required: true
    })
    @Expose()
    promotionalOffers: string;
}
