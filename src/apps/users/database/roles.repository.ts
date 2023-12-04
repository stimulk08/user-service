import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";
import { RoleModel } from "../entities/role.entity";
import { userRoles } from "../entities/user-role.entity";
import { types } from "cassandra-driver";
import {v4} from 'uuid'
@Injectable()
export class RolesRepository extends CassandraRepository<RoleModel> {
    constructor(protected connection: CassandraConnection) {
        super(
            connection,
            'roles',
            [
                { name: 'id', type: 'uuid' }
            ],
            {
                partition: [
                    { name: 'name', type: 'text' }    
                ],
                claster: [],
            });
    }

    async init() {
        Promise.all(
            userRoles.map(
                async (role) =>  {
                    console.log({ id: v4(), name: role })
                    await this.create({ id: types.Uuid.random().toString(), name: role })
                }
            ));
    }
    async findByName(name: string): Promise<RoleModel> {
        return this.findOne({ name: {operator: '=', value: name} });
    }
}
