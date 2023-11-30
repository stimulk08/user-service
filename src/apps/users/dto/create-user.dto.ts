import { ApiProperty } from "@nestjs/swagger";
import { UserRole, userRoles } from "../entities/user.entity";
import { IsEmail, IsNotEmpty, IsIn } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    secondName: string;

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