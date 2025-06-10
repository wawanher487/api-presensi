import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfilingDocument = Profiling & Document;

@Schema({ timestamps: true, collection: 'profiling' })
export class Profiling {
  @Prop({ required: true, default: Date.now })
  date: string;

  @Prop({ required: true })
  guid: string;

  @Prop({ required: true })
  userGuid: string;

  @Prop({ required: true })
  nama: string;

  @Prop({ required: true, default: '0' })
  keletihan: number;

  @Prop({ required: true, default: '0' })
  bahagia: number;

  @Prop({ required: true, default: '0' })
  sedih: number;

  @Prop({ required: true, default: '0' })
  marah: number;

  @Prop({ required: true, default: '0' })
  netral: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProfilingSchema = SchemaFactory.createForClass(Profiling);
