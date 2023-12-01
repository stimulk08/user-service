import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { User, UserRole } from "../entities/user.entity";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends CassandraRepository<User> {
    constructor(protected connection: CassandraConnection) {
        super(
            connection,
            'users',
            [
                'firstName text',
                'secondName text',
                'role text',
                'email text',
                'password text',
                'creationdate timestamp'
            ], 'id uuid');
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
        query += ` ALLOW FILTERING`;
        console.log(query);
        console.log(Date.now());
        return this.connection.execute(query, params).then(this.resultToModels);
    }
}