import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HistoryModule } from './history/history.module';
import { MainDbModule, SecondaryDbModule } from './config/database';
import { HistoryAiModule } from './history_ai/history_ai.module';
import { ProfilingModule } from './profiling/profiling.module';
import { KaryawanModule } from './karyawan/karyawan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MainDbModule,
    SecondaryDbModule,
    HistoryModule,
    HistoryAiModule,
    ProfilingModule,
    KaryawanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
