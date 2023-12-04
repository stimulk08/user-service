import { ApiProperty } from "@nestjs/swagger";
import { IdDatabaseModel } from "src/common/Types/model";
import { UserRole } from "./user-role.entity";

export class User extends IdDatabaseModel {
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

    @ApiProperty()
    creationDate: string;
}
