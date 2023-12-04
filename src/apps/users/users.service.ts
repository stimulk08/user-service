import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CrudService } from 'src/common/Types/crud.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './database/users.repository';
import  { v4 } from 'uuid';
import { UserRole } from './entities/user-role.entity';
import { RolesRepository } from './database/roles.repository';
import { UserRolesRepository } from './database/user-role.repository';
import { RegistrationsRepository } from './database/registration.repository';

@Injectable()
export class UsersService extends CrudService<string, User>{
  constructor(
    protected readonly repository: UsersRepository,
    private roles: RolesRepository,
    private userRoles: UserRolesRepository,
    private registrations: RegistrationsRepository
  ) {
    super(User.name, repository);
  }
  async create(dto: CreateUserDto) {
    const roleModel = await this.roles.findByName(dto.role);
    if (!roleModel) throw new BadRequestException('Role not found');
    console.log(roleModel);
    const userId = v4();
    const creationDate = new Date(Date.now()).toUTCString();
    const user = await this.repository.create({... dto, creationDate  }, userId);
    await this.userRoles.create({ userId: userId, role: roleModel.id, creationDate });
    await this.registrations.create({ userId: userId, date: creationDate });
    return user;
  }

  async filter(role?: UserRole, fromDate?: number, toDate?: number) {
    await this.repository.initTable();
    await this.roles.initTable();
    await this.roles.init();
    await this.userRoles.initTable();
    await this.registrations.initTable();
    console.log(role, fromDate, toDate);
    console.log('ROLES', await this.roles.findAll());


    // if (!(role || fromDate || toDate)) return this.repository.findAll();
    // return this.repository.filter(role, fromDate, toDate);
  }
}
