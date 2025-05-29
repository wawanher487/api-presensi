import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('MONGO_URI'),
        dbName: ConfigService.get<string>('MONGO_DB_NAME')
      }),
      inject: [ConfigService]
    }),
    HistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
