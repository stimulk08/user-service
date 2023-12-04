import { IdDatabaseModel } from "src/common/Types/model";
import { UserRole } from "./user-role.entity";

export class RoleModel extends IdDatabaseModel {
    name: UserRole;
 }