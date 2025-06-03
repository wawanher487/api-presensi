import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'SECONDARY_DB',
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('SECONDARY_MONGO_URI'),
        dbName: config.get<string>('SECONDARY_MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class SecondaryDbModule {}
