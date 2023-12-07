import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { User } from "../entities/user.entity";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";
import { UserRole } from "../entities/user-role.entity";

@Injectable()
export class UsersRepository extends CassandraRepository<User> {
    constructor(protected connection: CassandraConnection) {
        super(
            connection,
            'users',
            [
                {
                    name: 'first_name',
                    type: 'text',
                },
                {
                    name: 'second_name',
                    type: 'text',
                },
                {
                    name: 'role',
                    type: 'text',
                },
                {
                    name: 'email',
                    type: 'text',
                },
                {
                    name: 'password',
                    type: 'text',
                },
                {
                    name: 'creation_date',
                    type: 'timestamp',
                }
            ], {
                partition: [
                    {
                        name: 'id',
                        type: 'uuid',
                    },
                ],
                claster: [],
            });
    }

    async getByIds(ids: string[]) {
        return this.find({ id: { operator: 'IN', value: ids } });
    }

    async filter(role?: UserRole, fromDate?: number, toDate?: number) {
        let query = `SELECT * FROM ${this.connection.keyspace}.users WHERE`;
        let needAnd = false;
        const params = [];

        if (role) {
            query = `${query} role = ?`;
            needAnd = true;
            params.push(role);
        };
        if (fromDate) {
            query = `${query} ${needAnd ? 'AND' : ''} creationDate >= ?`;
            needAnd = true;
            params.push(fromDate);
        };
        if (toDate) {
            query = `${query} ${needAnd ? 'AND' : ''} creationDate <= ?`;
            params.push(toDate);
        }
        return this.connection.execute(query, params).then(this.resultToModels);
    }
}