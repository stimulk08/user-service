import { CassandraRepository } from "src/libs/cassandra/cassandra.repository";
import { CassandraConnection } from "src/libs/cassandra/cassanra-connection";
import { Injectable } from "@nestjs/common";
import { RegistrationModel } from "../entities/registration.entity";

@Injectable()
export class RegistrationsRepository extends CassandraRepository<RegistrationModel> {
    constructor(protected connection: CassandraConnection) {
        super(
            connection,
            'registrations',
            [],
            {
                partition: [
                    { name: 'user_id', type: 'uuid' },
                    { name: 'date', type: 'timestamp' },
                ],
                claster: [],
            });
    }
}