import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHistoryAiDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  mood?: string;

  @IsNumber()
  @IsOptional()
  keletihan?: number;

  @IsString()
  @IsOptional()
  status_absen?: string;

  @IsString()
  @IsOptional()
  gambar?: string;

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
  datetime?: string;

  @IsNumber()
  @IsOptional()
  timestame?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  process?: string;

  @IsString()
  @IsOptional()
  jam_masuk?: string;

  @IsString()
  @IsOptional()
  jam_keluar?: string;

  @IsString()
  @IsOptional()
  jam_masuk_actual?: string;

  @IsString()
  @IsOptional()
  jam_keluar_actual?: string;

  @IsNumber()
  @IsOptional()
  jumlah_telat?: number;

  @IsNumber()
  @IsOptional()
  total_jam_telat?: number;
}
