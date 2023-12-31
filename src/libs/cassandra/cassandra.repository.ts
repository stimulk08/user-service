import { Injectable } from '@nestjs/common';
import { DatabaseModel } from 'src/common/Types/model';
import { Repository } from 'src/common/Types/repository';
import { CassandraConnection } from './cassanra-connection';
import { types } from "cassandra-driver";
import { TableField, fieldToString } from './Types/table-field';
import { PrimaryKey, primaryKeyToString } from './Types/primary-key';
import { PartialRecord } from 'src/common/Types/partial-record';
import { QueryParam } from './Types/query-param';

@Injectable()
export abstract class CassandraRepository<T extends DatabaseModel> implements Repository<string, T> {
    private tableRef: string;
    constructor(
        private readonly _connection: CassandraConnection,
        private readonly tableName: string,
        private readonly columns: TableField[],
        private readonly primaryKey: PrimaryKey,
    ) {
        this.tableRef = `${this._connection.keyspace}.${this.tableName}`;
    }

    async initTable() {
        await this._connection.createKeyspace();
        await this.drop();
        const  query = `CREATE TABLE IF NOT EXISTS ${this.tableRef} (${[...this.primaryKey.partition, ...this.primaryKey.claster,...this.columns].map(fieldToString).join(',')}, ${primaryKeyToString(this.primaryKey)})`;
        await this._connection.execute(query);
    }

    async findAndRemove(params: PartialRecord<keyof T, QueryParam>) {
        const query = `DELETE FROM ${this.tableRef} WHERE ${Object.keys(params).map(f => `${f} ${params[f].operator} ?`).join(' AND ')}`;
        const data = Object.keys(params).map(f => params[f].value);
        return this._connection.execute(query, data);
    }

    async findOne(params: PartialRecord<keyof T, QueryParam>): Promise<T | null> {
        return this.find(params, 1).then(results => results[0] ?? null);
    }

    async find(params: PartialRecord<keyof T, QueryParam>, limit?: number) {
        let query = `SELECT * FROM ${this.tableRef} WHERE ${Object.keys(params).map(f => `${f} ${params[f].operator} ?`).join(' AND ')}`;
        const data = Object.keys(params).map(f => params[f].value);
        if (limit) query += ` LIMIT ${limit}`;
        return this._connection.execute(query, data).then(this.resultToModels);
    }

    resultToModel(result: types.ResultSet): T {
        return result.rows[0] as never as T;
    }

    resultToModels(result: types.ResultSet): T[] {
        return result.rows.map(row => row as never as T);
    }

    async drop() {
        await this._connection.execute(`DROP TABLE IF EXISTS ${this.tableRef}`);
    }

    async findById(id: string): Promise<T | null> {
        return this._connection
            .execute(`SELECT * FROM ${this.tableRef} WHERE id = ?`, [id])
            .then(this.resultToModel);
    };

    async create(model: T, id?: string): Promise<T> {
        const keys = [];
        const values = [];
        if (id) model = {...model, id};
        for (const key in model) {
            keys.push(key);
            values.push(model[key]);
        }
        const query = `INSERT INTO ${this.tableRef} (${keys.join(',')}) VALUES (${values.map(() => '?').join(',')})`;

        return this._connection.execute(
            query,
            values
        ).then(() => model);
    };


    async findByIdAndRemove(id: string) {
        return this._connection.execute(`DELETE FROM ${this.tableRef} WHERE id = ?`, [id]);
    };

    async findByIdAndUpdate(id: string, data: any) {
        const updates = Object.keys(data).map(key => `${key} = ?`).join(',');
        return this._connection.execute(`UPDATE ${this.tableRef} SET ${updates} WHERE id = ?`, [...Object.values(data), id]).then(() => data);
    };

    async findAll(): Promise<T[]> {
        return this._connection.execute(`SELECT * FROM ${this.tableRef}`)
            .then(this.resultToModels);
    };
}
