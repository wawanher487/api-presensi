import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateHistoryAiDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  mood: string;

  @IsNumber()
  @IsNotEmpty()
  keletihan: number;

  @IsString()
  @IsNotEmpty()
  status_absen: string;

  @IsString()
  @IsNotEmpty()
  gambar: string;

  @IsString()
  @IsOptional()
  guid?: string;

  @IsString()
  @IsOptional()
  guid_device?: string;

  @IsString()
  @IsNotEmpty()
  datetime: string;

  @IsNumber()
  @IsNotEmpty()
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

  @IsString()
  keletihan?: number;

  @IsString()
  status_absen: string;

  @IsString()
  gambar: string;

  @IsString()
  guid: string;

  @IsString()
  guid_device?: string;

  @IsString()
  datetime: string;

  @IsNumber()
  timestamp: number;

  @IsString()
  unit: string;

  @IsString()
  process?: string;
}
