import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './schema/history.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: History.name, schema: HistorySchema}])],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule {}
