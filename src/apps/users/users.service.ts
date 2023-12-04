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
    const user = await this.repository.create({...dto, creation_date: creationDate, id: types.Uuid.random().toString() }, userId);
    await this.userRoles.create({ user_id: userId, role: roleModel.id, creation_date: creationDate });
    await this.registrations.create({ user_id: userId, date: creationDate });
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
    if (!(role || fromDate || toDate)) return this.repository.findAll();
    const roleId = await this.roles.findOneByRole(role);
    return this.userRoles.findByRole(roleId.id)
        .then(usersRole => {
           if (!usersRole.length) return [];
           const ids = usersRole.map(ur => ur.user_id.toString());
           return this.repository.find({ id: { operator: 'IN', value: ids } });
        });


    
  }
}
