import { CassandraModule } from './libs/cassandra/cassandra.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './apps/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot(), 
      CassandraModule,
      UsersModule
  ],
  providers: [],
})
export class AppModule {}
