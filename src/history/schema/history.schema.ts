import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class History extends Document {
  @Prop()
  datetime: string;

  @Prop()
  timestamp: number;

  // nama file gambar
  @Prop({ name: 'gambar' })
  value: string;

  @Prop()
  guid_device: string;

  @Prop()
  guid: string;

  @Prop({ default: 'tamu' })
  unit: string;

  @Prop({ default: false })
  process: boolean;

  @Prop({ default: false })
  checkStatus: boolean;

  @Prop()
  create_at: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
