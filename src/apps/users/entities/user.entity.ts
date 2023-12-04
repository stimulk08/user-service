import { ApiProperty } from "@nestjs/swagger";
import { IdDatabaseModel } from "src/common/Types/model";
import { UserRole } from "./user-role.entity";

export class User extends IdDatabaseModel {
    @ApiProperty()
    first_name: string;

    @ApiProperty()
    second_name: string;

    @ApiProperty()
    role: UserRole;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    creation_date: string;
}
