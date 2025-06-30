import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type KaryawanDocument = Karyawan & Document;

@Schema({ timestamps: true, collection: 'karyawan' })
export class Karyawan {
  @Prop({ required: true })
  nama: string;

  @Prop({ default: '' })
  gambar: string;

  @Prop({ required: true, unique: true, default: uuidv4 })
  userGuid: string;

  @Prop({required: true})
  nip: string;

  @Prop({required: true})
  jabatan: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  guidUnit: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ default: 0 })
  gajiHarian: number;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const KaryawanSchema = SchemaFactory.createForClass(Karyawan);
