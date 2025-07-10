import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateHistoryAiDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsOptional()
  mood?: string;

  @IsNumber()
  @IsOptional()
  keletihan?: number;


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  status_absen?: string[];

  @IsString()
  @IsNotEmpty()
  gambar: string;

  @IsString()
  @IsOptional()
  userGuid?: string;

  @IsString()
  @IsOptional()
  guid?: string;

  @IsString()
  @IsOptional()
  guid_device?: string;

  @IsString()
  @IsOptional()
  datetime: string;

  @IsNumber()
  @IsOptional()
  timestamp?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  process?: string;

  @IsString()
  @IsOptional()
  jam_masuk: string;

  @IsString()
  @IsOptional()
  jam_keluar: string;

  @IsString()
  @IsOptional()
  jam_masuk_actual?: string;

  @IsString()
  @IsOptional()
  jam_keluar_actual?: string;

  @IsNumber()
  @IsOptional()
  jumlah_telat: number;

  @IsNumber()
  @IsOptional()
  total_jam_telat: number;
}

export class HistoryAiResponse {
  id: string;

  @IsString()
  nama: string;

  @IsString()
  mood?: string;

  @IsNumber()
  keletihan?: number;

  status_absen?: string[];

  @IsString()
  gambar: string;

  @IsString()
  userGuid: string;

  @IsString()
  guid: string;

  @IsString()
  guid_device?: string;

  @IsOptional()
  datetime?: string;

  @IsOptional()
  timestamp?: number;

  @IsString()
  unit: string;

  @IsString()
  process?: string;

  @IsString()
  jam_masuk?: string;

  @IsString()
  jam_keluar?: string;

  @IsString()
  jam_masuk_actual?: string;

  @IsString()
  jam_keluar_actual?: string;

  @IsOptional()
  @IsNumber()
  jumlah_telat?: number;

  @IsOptional()
  @IsNumber()
  total_jam_telat?: number;

  createdAt?: Date;

  updatedAt?: Date;
}
