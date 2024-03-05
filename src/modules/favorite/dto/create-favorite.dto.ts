import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFavoriteDto {
    @ApiProperty({
        description: "The user id of the favorite",
        type: String,
        example: 1,
        required: true
    })
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @ApiProperty({
        description: "The carrier id of the favorite",
        type: String,
        example: 1,
        required: true
    })
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    carrierId: number
}
