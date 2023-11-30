import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CassandraConnection } from './cassanra-connection';

@Module({
    imports: [ConfigModule],
    providers: [CassandraConnection],
    exports: [CassandraConnection]
})
export class CassandraModule {}
