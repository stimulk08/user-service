import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { User } from "../entities/user.entity";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends CassandraRepository<User> {
    constructor(connection: CassandraConnection) {
        super(connection, 'users');
    }
}