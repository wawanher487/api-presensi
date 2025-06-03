import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HistoryModule } from './history/history.module';
import { MainDbModule, SecondaryDbModule } from './config/database';
import { HistoryAiModule } from './history_ai/history_ai.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    MainDbModule,
    SecondaryDbModule,
    HistoryModule,
    HistoryAiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
