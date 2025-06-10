import { Module } from '@nestjs/common';
import { ProfilingService } from './profiling.service';
import { ProfilingController } from './profiling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilingSchema } from './schema/profiling.schema';

@Module({
  imports: [
  MongooseModule.forFeature(
    [{ name: 'Profiling', schema: ProfilingSchema }],
    'SECONDARY_DB',
  ),
  ],
  controllers: [ProfilingController],
  providers: [ProfilingService],
})
export class ProfilingModule {}
