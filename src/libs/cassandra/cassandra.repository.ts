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

    resultToModel(result: types.ResultSet): T {
        return result.rows[0] as never as T;
    }

    resultToModels(result: types.ResultSet): T[] {
        return result.rows.map(row => row as never as T);
    }

    async drop() {
        await this._connection.execute(`DROP TABLE IF EXISTS ${this._connection.keyspace}.${this.tableName}`);
    }

    async findById(id: string): Promise<T | null> {
        return this._connection
            .execute(`SELECT * FROM ${this._connection.keyspace}.${this.tableName} WHERE id = ?`, [id])
            .then(this.resultToModel);
    };

    async create(model: T): Promise<T> {
        const keys = [];
        const values = [];
        for (const key in model) {
            if (key === 'id') continue;
            keys.push(key);
            values.push(model[key]);
        }
        return this._connection.execute(
            `INSERT INTO ${this._connection.keyspace}.${this.tableName} (id,${keys.join(',')}) VALUES (?,${values.map(() => '?').join(',')})`,
             [types.Uuid.fromString(model.id), ...values]).then((res) => { console.log(res); return model;});
    };


    async findByIdAndRemove(id: string) {
        return this._connection.execute(`DELETE FROM ${this._connection.keyspace}.${this.tableName} WHERE id = ?`, [id]);
    };

    async findByIdAndUpdate(id: string, data: any) {
        const updates = Object.keys(data).map(key => `${key} = ?`).join(',');
        return this._connection.execute(`UPDATE ${this._connection.keyspace}.${this.tableName} SET ${updates} WHERE id = ?`, [...Object.values(data), id]).then(() => data);
    };

    async findAll(): Promise<T[]> {
        return this._connection.execute(`SELECT * FROM ${this._connection.keyspace}.${this.tableName}`)
            .then(this.resultToModels);
    };
}
