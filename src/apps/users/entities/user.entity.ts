import { ApiProperty } from "@nestjs/swagger";
import { DatabaseModel } from "src/common/Types/model";

export const userRoles = ['admin', 'owner', 'support', 'manager', 'teamleader'] as const;
export type UserRole = typeof userRoles[number];

export class User extends DatabaseModel {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    secondName: string;

    @ApiProperty()
    role: UserRole;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}
