import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";
import { UserRoleModel } from "../entities/user-role.entity";

@Injectable()
export class UserRolesRepository extends CassandraRepository<UserRoleModel> {
    constructor(protected connection: CassandraConnection) {
        super(
            connection,
            'user_roles',
            [], {
                partition: [
                    { name: 'role', type: 'uuid' },
                ],
                claster: [
                    { name: 'user_id', type: 'uuid' },
                ],
            });
    }

    async findOneByRole(roleId: string): Promise<UserRoleModel> {
        return this.findOne({ role: {operator: '=', value: roleId} });
    }

    async findByRole(roleId: string): Promise<UserRoleModel[]> {
        return this.find({ role: {operator: '=', value: roleId} });
    }

    async findByRoles(roleIds: string[]): Promise<UserRoleModel[]> {
        return this.find({ role: {operator: 'IN', value: roleIds} });
    }
}