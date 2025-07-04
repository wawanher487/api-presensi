import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryAiDocument = HistoryAi & Document;

@Schema({ timestamps: true, collection: 'history_ai' })
export class HistoryAi {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gambar: string;

  @Prop({ required: true })
  mood: string;

  @Prop({ required: true })
  keletihan: number;

  @Prop({
    required: true,
  })
  status_absen: string;

  @Prop()
  userGuid: string;

  @Prop({ required: true })
  guid: string;

  @Prop({ required: true })
  guid_device: string;

  @Prop({ required: true, default: Date.now })
  datetime: string;

  @Prop({ required: true, default: Date.now })
  timestamp: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  process: string;

  @Prop()
  jam_masuk: string;

  @Prop()
  jam_keluar: string;

  @Prop({ type: String, default: null })
  jam_masuk_actual: string;

  @Prop({ type: String, default: null })
  jam_keluar_actual: string;

  @Prop({ default: 0 })
  jumlah_telat: number;

  @Prop({ default: 0 })
  total_jam_telat: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const HistoryAiSchema = SchemaFactory.createForClass(HistoryAi);
