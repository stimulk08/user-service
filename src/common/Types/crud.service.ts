import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from './repository';
import { DatabaseModel } from './model';
import { PartialRecord } from './partial-record';

export abstract class CrudService<
  K extends string | number,
  V extends DatabaseModel,
> {
  constructor(
    private entityName: string,
    protected repository: Repository<K, V>,
  ) {}

  abstract create(dto: any, ...params: any[]): Promise<V>;

  async findById(id: K) {
    return this.repository.findById(id);
  }

  async findOne(id: K) {
    return this.repository.findById(id);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOneOrThrow(
    id: K,
    errorText = `${this.entityName} not found`,
  ): Promise<V> {
    const result = await this.repository.findById(id);
    if (result) return result;
    throw new NotFoundException(errorText);
  }

  async throwIfExists(id: K, errorText = `${this.entityName} not found`) {
    const result = await this.repository.findById(id);
    if (!result) throw new ConflictException(errorText);
  }

  async remove(id: K) {
    return this.repository.findByIdAndRemove(id);
  }

  async update(id: K, data: PartialRecord<keyof V, any>) {
    return this.repository.findByIdAndUpdate(id, data);
  }
}