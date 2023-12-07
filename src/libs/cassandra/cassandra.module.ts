import { ConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { CassandraConnection } from './cassanra-connection';

@Module({
    imports: [ConfigModule],
    providers: [CassandraConnection],
    exports: [CassandraConnection]
})
export class CassandraModule {
    forRoot(): DynamicModule {
        return { 
            module: CassandraModule,
            imports: [ ConfigModule], 
            providers: [ CassandraConnection ], 
            exports: [ CassandraConnection ]
        }; 
    }
}
