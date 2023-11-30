import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './database/users.repository';
import { CassandraModule } from 'src/libs/cassandra/cassandra.module';

@Module({
  imports: [CassandraModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
