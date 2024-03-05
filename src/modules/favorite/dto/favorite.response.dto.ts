import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CarrierOneResponseDto } from "src/modules/carrier/dto/carrier-one-response.dto";
import { UserOneResponseDto } from "src/modules/users/dto/user-one-response.dto";

export class FavoriteResponseDto {
    @ApiProperty({
        description: "The user id of the favorite",
        type: String
    })
    @Expose()
    userId: number

    @ApiProperty({
        description: "The carrier id of the favorite",
        type: String
    })
    @Expose()
    carrierId: number

    @ApiProperty({
        description: "User",
        type: UserOneResponseDto
    })
    @Expose()
    @Type(() => UserOneResponseDto)
    @ValidateNested()
    user: UserOneResponseDto;

    @ApiProperty({
        description: "The carrier",
        type: CarrierOneResponseDto 
    })
    @Expose()
    @Type(() => CarrierOneResponseDto)
    @ValidateNested()
    carrier: CarrierOneResponseDto;
}
