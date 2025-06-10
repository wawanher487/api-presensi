import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfilingDto {
  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  guid?: string;

  @IsString()
  @IsOptional()
  userGuid?: string;

  @IsString()
  @IsOptional()
  nama?: string;

  @IsNumber()
  @IsOptional()
  keletihan?: number;

  @IsNumber()
  @IsOptional()
  bahagia?: number;

  @IsNumber()
  @IsOptional()
  sedih?: number;

  @IsNumber()
  @IsOptional()
  marah?: number;

  @IsNumber()
  @IsOptional()
  netral?: number;
}
