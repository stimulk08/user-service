import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { ArrayOrObject, Client } from "cassandra-driver";

@Injectable()
export class CassandraConnection {
    private readonly _client: Client;
    public readonly keyspace: string;
    constructor(config: ConfigService) {
        this._client = new Client({
            contactPoints: [config.get('DATABASE_URL')],
            localDataCenter: config.get('DATABASE_LOCAL_DC'),
            keyspace: config.get('DATABASE_KEYSPACE'),
            credentials: { username: config.get('DATABASE_USERNAME'), password: config.get('DATABASE_PASSWORD') }
        });
    }

    async connect() {
        this._client.connect();
    }

    async disconnect() {
        this._client.shutdown();
    }

    async execute(query: string, params?: ArrayOrObject) {
        return this._client.execute(query, params);
    }
}