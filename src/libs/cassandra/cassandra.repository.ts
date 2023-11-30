import { Injectable } from '@nestjs/common';
import { DatabaseModel } from 'src/common/Types/model';
import { Repository } from 'src/common/Types/repository';
import { CassandraConnection } from './cassanra-connection';

@Injectable()
export abstract class CassandraRepository<T extends DatabaseModel> implements Repository<string, T> {
    constructor(
        private readonly _connection: CassandraConnection,
        private readonly tableName: string
    ) {}

    async findById(id: string) {
        return this._connection.execute(`SELECT * FROM ${this.tableName} WHERE id = ${id}`);
    };

    async create(model: T) {
        return this._connection.execute(`INSERT INTO ${this.tableName} VALUES (?)`, [model]).then(() => model);
    };

    async findByIdAndRemove(id: string) {
        return this._connection.execute(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    };

    async findByIdAndUpdate(id: string, data: any) {
        return this._connection.execute(`UPDATE ${this.tableName} SET ? WHERE id = ?`, [data, id]).then(() => data);
    };

    async findAll(limit?: number) {
        return this._connection.execute(`SELECT * FROM ${this.tableName} LIMIT= ?`, [limit]).then(() => []);
    };
}
