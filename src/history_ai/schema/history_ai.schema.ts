import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryAiDocument = HistoryAi & Document;

@Schema({ timestamps: true, collection: 'history_ai' })
export class HistoryAi {
    @Prop({ required: true })
    nama: string;

    @Prop({ required: true })
    gambar: string;

    @Prop({ required: true })
    mood: string;

    @Prop({ required: true })
    keletihan: number;

    @Prop({required: true, enum: ['hadir', 'terlambat', 'pulang', 'tidak hadir', 'izin', 'sakit'] })
    status_absen: string;

    @Prop({ required: true })
    guid: string;

    @Prop({ required: true })
    guid_device: string;

    @Prop({ required: true, default: Date.now })
    datetime: string;

    @Prop({ required: true })
    timestamp: number;

    @Prop({ required: true })
    unit: string;

    @Prop({ required: true })
    process: string;
}

export const HistoryAiSchema = SchemaFactory.createForClass(HistoryAi);