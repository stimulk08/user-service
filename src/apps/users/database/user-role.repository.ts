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
                { name: 'role', type: 'uuid' }
            ], {
                partition: [
                    { name: 'userId', type: 'uuid' },
                ],
                claster: [
                    { name: 'creationDate', type: 'timestamp' },
                ],
            });
    }
}