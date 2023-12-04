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
import { types } from 'cassandra-driver';

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
    const roleModel = await this.roles.findOneByRole(dto.role);
    if (!roleModel) throw new BadRequestException('Role not found');
    console.log(roleModel);
    const userId = v4();
    const creationDate = new Date(Date.now()).toUTCString();
    const user = await this.repository.create({... dto, creationDate, id: types.Uuid.random().toString()  }, userId);
    await this.userRoles.create({ userId: userId, role: roleModel.id, creationDate });
    await this.registrations.create({ userId: userId, date: creationDate });
    return user;
  }

  async dropDb() {
        await this.repository.initTable();
    await this.roles.initTable();
    await this.roles.init();
    await this.userRoles.initTable();
    await this.registrations.initTable();
  }

  async filter(role?: UserRole, fromDate?: number, toDate?: number) {
    await this.dropDb();
    console.log(role, fromDate, toDate);

    const roleId = await this.roles.findOneByRole(role);
    console.log('ROLE', roleId);
    return this.userRoles.findByRole(roleId.id)
        .then(usersRole => {
           const ids = usersRole.map(ur => ur.userId);
           return this.repository.find({ id: { operator: 'IN', value: ids } });
        });


    // if (!(role || fromDate || toDate)) return this.repository.findAll();
    // return this.repository.filter(role, fromDate, toDate);
  }
}
