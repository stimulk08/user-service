import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsIn } from "class-validator";
import { userRoles, UserRole } from "../entities/user-role.entity";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    second_name: string;

    @ApiProperty({enum: userRoles})
    @IsNotEmpty()
    @IsIn(userRoles)
    role: UserRole;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}