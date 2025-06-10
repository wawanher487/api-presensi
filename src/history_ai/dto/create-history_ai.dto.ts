import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateHistoryAiDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  mood: string;

  @IsNumber()
  @IsOptional()
  keletihan?: number;

  @IsString()
  @IsNotEmpty()
  status_absen: string;

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
  timestamp: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsString()
  @IsOptional()
  process?: string;
}

export class HistoryAiResponse {
  id: string;

  @IsString()
  nama: string;

  @IsString()
  mood?: string;

  @IsNumber()
  keletihan?: number;

  @IsString()
  status_absen: string;

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

  createdAt?: Date;

  updatedAt?: Date;
}
