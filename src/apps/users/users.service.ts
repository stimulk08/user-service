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
import { ConfigService } from '@nestjs/config';
import { getDates } from 'src/common/extensions/date';
import dayjs from 'dayjs';
import { getIntersection } from 'src/common/extensions/array';

@Injectable()
export class UsersService extends CrudService<string, User>{
  constructor(
    protected readonly repository: UsersRepository,
    private roles: RolesRepository,
    private userRoles: UserRolesRepository,
    private registrations: RegistrationsRepository,
    private config: ConfigService
  ) {
    super(User.name, repository);
  }
  async create(dto: CreateUserDto) {
    const roleModel = await this.roles.findOneByRole(dto.role);
    if (!roleModel) throw new BadRequestException('Role not found');
    console.log(roleModel);
    const userId = v4();
    const creationDate = dayjs().format('YYYY-MM-DD');
    console.log();
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

  async filter(roles?: UserRole[], fromDate?: number, toDate?: number) {
    if (!(roles.length || fromDate || toDate)) return this.repository.findAll();
    let roleResultIds = [];
    if (roles.length) {
      const roleModels = await this.roles.findByRoles(roles);
      roleResultIds = await this.userRoles.findByRoles(roleModels.map((role) => role.id))
          .then(usersRole => {
            if (!usersRole.length) return [];
            return usersRole.map(ur => ur.user_id.toString());
          });
    }
    const dateIds = await this.filterByDate(fromDate, toDate);
    const resultIds = getIntersection(roleResultIds, dateIds);
    console.log(roleResultIds, dateIds, resultIds);
    if (!resultIds.length) return [];
    return this.repository.getByIds(resultIds);
  }

  async filterByDate(fromDate?: number, toDate?: number): Promise<string[]> {
    if (!(fromDate || toDate)) return [];
  
    toDate = toDate ? toDate * 1000 : Date.now();
    const dates = getDates(
      fromDate ? new Date(fromDate * 1000) : new Date(this.config.get<string>('BASE_DATE')),
      new Date(toDate)
    );
    console.log(dates);
    if (!dates.length) return [];
    const users = await this.registrations.find({ date: { operator: 'IN', value: dates } });
    return users.map(user => user.user_id.toString());
   }
}
