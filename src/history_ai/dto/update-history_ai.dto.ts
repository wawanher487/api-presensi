import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHistoryAiDto {
  @IsString()
  @IsOptional()
  nama?: string;

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
}
