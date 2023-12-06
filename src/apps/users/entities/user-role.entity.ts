import { DatabaseModel } from "src/common/Types/model";

export const userRoles = ['admin', 'owner', 'support', 'manager', 'teamleader'] as const;
export type UserRole = typeof userRoles[number];

export class UserRoleModel extends DatabaseModel { 
    role: string;
    user_id: string;
}