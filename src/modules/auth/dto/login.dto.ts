import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    title: "Email",
    description: "Email of the user",
    example: "admin@admin.com",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    title: "Password",
    description: "Password of the user",
    example: "admin",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
