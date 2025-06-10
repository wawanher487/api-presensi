import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfilingDto {
  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  guid: string;

  @IsString()
  @IsOptional()
  userGuid: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsNumber()
  @IsOptional()
  keletihan: number;

  @IsNumber()
  @IsOptional()
  bahagia: number;

  @IsNumber()
  @IsOptional()
  sedih: number;

  @IsNumber()
  @IsOptional()
  marah: number;

  @IsNumber()
  @IsOptional()
  netral: number;
}

export class ProfilingResponse {
  id: string;

  @IsOptional()
  date?: string;

  @IsString()
  guid: string;

  @IsString()
  userGuid: string;

  @IsString()
  nama: string;

  @IsNumber()
  keletihan: number;

  @IsNumber()
  bahagia: number;

  @IsNumber()
  sedih: number;

  @IsNumber()
  marah: number;

  @IsNumber()
  netral: number;

  createdAt?: Date;
  
  updatedAt?: Date;
}
