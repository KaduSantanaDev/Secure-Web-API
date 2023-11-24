import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetPasswordDto {
    @IsStrongPassword()
    password: string

    @IsJWT()
    token: string
}