import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CrudService } from 'src/common/Types/crud.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './database/users.repository';
import  { v4 } from 'uuid';

@Injectable()
export class UsersService extends CrudService<string, User>{
  constructor(protected readonly repository: UsersRepository) {
    super(User.name, repository);
  }
  async create(dto: CreateUserDto) {
    return this.repository.create({... dto, id: v4(), creationDate: Date.now() });
  }
}
