import { Injectable } from '@nestjs/common';
import { DatabaseModel } from 'src/common/Types/model';
import { Repository } from 'src/common/Types/repository';
import { CassandraConnection } from './cassanra-connection';
import { types } from "cassandra-driver";
@Injectable()
export abstract class CassandraRepository<T extends DatabaseModel> implements Repository<string, T> {
    constructor(
        private readonly _connection: CassandraConnection,
        private readonly tableName: string,
        private readonly columns: string[],
        private readonly primaryKey: string,
    ) {}

    async initTable() {
        await this._connection.createKeyspace();
        await this.drop();
        await this._connection.execute(`CREATE TABLE IF NOT EXISTS ${this._connection.keyspace}.${this.tableName} (${this.columns.join(',')}, ${this.primaryKey} PRIMARY KEY)`);
    }

    async drop() {
        await this._connection.execute(`DROP TABLE IF EXISTS ${this._connection.keyspace}.${this.tableName}`);
    }

    async findById(id: string) {
        return this._connection.execute(`SELECT * FROM ${this._connection.keyspace}.${this.tableName} WHERE id = ${id}`);
    };

    async create(model: T) {
        console.log(this._connection.keyspace);
        const keys = [];
        const values = [];
        for (const key in model) {
            keys.push(key);
            values.push(key === 'id' ? types.Uuid.fromString(model[key] as string) : model[key]);
        }
        console.log(keys);
        console.log(values);
        return this.initTable()
        .then(() => this._connection.execute(
            `INSERT INTO ${this._connection.keyspace}.${this.tableName} (${keys.join(',')}) VALUES (${values.map(() => '?').join(',')})`,
             [values]).then(() => model));
    };

    async findByIdAndRemove(id: string) {
        return this._connection.execute(`DELETE FROM ${this._connection.keyspace}.${this.tableName} WHERE id = ?`, [id]);
    };

    async findByIdAndUpdate(id: string, data: any) {
        return this._connection.execute(`UPDATE ${this._connection.keyspace}.${this.tableName} SET ? WHERE id = ?`, [data, id]).then(() => data);
    };

    async findAll() {
        return this.initTable()
            .then(() => this._connection.execute(`SELECT * FROM ${this._connection.keyspace}.${this.tableName}`)
            .then((res) => {
                console.log(res);
                return [];
        }));
    };
}
