import { CassandraModule } from './libs/cassandra/cassandra.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './apps/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middlewares/log.middleware';

@Module({
  imports: [
      ConfigModule.forRoot(), 
      CassandraModule,
      UsersModule
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
