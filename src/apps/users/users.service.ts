import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CrudService } from 'src/common/Types/crud.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './database/users.repository';
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
    const id = types.Uuid.random().toString();
    const creationDate = dayjs().format('YYYY-MM-DD');
    const user = await this.repository.create({...dto, creation_date: creationDate, id }, id);
    await this.userRoles.create({ user_id: id, role: roleModel.id });
    await this.registrations.create({ user_id: id, date: creationDate });
    return user;
  }

  async dropDb() {
    await this.repository.initTable();
    await this.roles.initTable();
    await this.roles.init();
    await this.userRoles.initTable();
    await this.registrations.initTable();
  }

  async filter(roles?: UserRole[], fromDate?: string, toDate?: string) {
    if (!(roles.length || fromDate || toDate)) return this.repository.findAll();
    let roleResultIds: string[];

    if (roles.length) {
      const roleModels = await this.roles.findByRoles(roles);
      roleResultIds = await this.userRoles.findByRoles(roleModels.map((role) => role.id))
          .then(usersRole => {
            if (!usersRole.length) return [];
            return usersRole.map(ur => ur.user_id.toString());
          });
    }
    console.log('ROLES_RESULT_IDS', roleResultIds);
    const dateIds = await this.filterByDate(fromDate, toDate);
    console.log('DATE_RESULT_IDS', dateIds);
    let resultIds = [];
    if (!dateIds && !roleResultIds) {
      console.log('MERGE');
      resultIds = getIntersection(roleResultIds, dateIds)
    } else {
      resultIds = [...(roleResultIds ?? dateIds)]
    }
    console.log('RESULT_IDS', resultIds);
    if (!resultIds.length) return [];
    return this.repository.getByIds(resultIds);
  }

  override async remove(id: string): Promise<any> {
    const user = await this.findById(id);
    if (!user) return;
    await super.remove(id);
    await this.userRoles.findAndRemove({ user_id: { operator: '=', value: id}, role: { operator: '=', value: user.role }});
  }

  async filterByDate(fromDate?: string, toDate?: string): Promise<string[]> {
    if (!(fromDate || toDate)) return null;
  
    toDate = toDate || dayjs().format('YYYY-MM-DD');
    fromDate = fromDate || this.config.get<string>('BASE_DATE');

    const dates = getDates(new Date(fromDate), new Date(toDate));
    if (!dates.length) throw new BadRequestException('Invalid date range');
    const users = await this.registrations.find({ date: { operator: 'IN', value: dates } });
    return users.map(user => user.user_id.toString());
   }
}
