import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";
import { UserRoleModel } from "../entities/user-role.entity";

@Injectable()
export class UserRolesRepository extends CassandraRepository<UserRoleModel> {
    constructor(protected connection: CassandraConnection) {
        super(
            connection,
            'userRoles',
            [
                { name: 'userId', type: 'uuid' },

            ], {
                partition: [
                    { name: 'role', type: 'uuid' },
                ],
                claster: [
                    { name: 'creationDate', type: 'timestamp' },
                ],
            });
    }

    async findOneByRole(roleId: string): Promise<UserRoleModel> {
        return this.findOne({ role: {operator: '=', value: roleId} });
    }

    async findByRole(roleId: string): Promise<UserRoleModel[]> {
        return this.find({ role: {operator: '=', value: roleId} });
    }
}