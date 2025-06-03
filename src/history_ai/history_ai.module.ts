import { Module } from '@nestjs/common';
import { HistoryAiService } from './history_ai.service';
import { HistoryAiController } from './history_ai.controller';
import { HistoryAiSchema } from './schema/history_ai.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'HistoryAi', schema: HistoryAiSchema }],
      'SECONDARY_DB',
    ),
  ],
  controllers: [HistoryAiController],
  providers: [HistoryAiService],
})
export class HistoryAiModule {}
