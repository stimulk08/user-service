import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './database/users.repository';
import { CassandraModule } from 'src/libs/cassandra/cassandra.module';
import { RegistrationsRepository } from './database/registration.repository';
import { RolesRepository } from './database/roles.repository';
import { UserRolesRepository } from './database/user-role.repository';

@Module({
  imports: [CassandraModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RegistrationsRepository, RolesRepository, UserRolesRepository],
  exports: [UsersService],
})
export class UsersModule {}
