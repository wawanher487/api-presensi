import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateKaryawanDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsOptional()
  gambar?: string;

  @IsOptional()
  guid?: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  nip: string;

  @IsString()
  @IsOptional()
  jabatan: string;

  @IsDateString() 
  @IsOptional()
  birthDate: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  guidUnit: string;

  @IsString()
  @IsOptional()
  unit: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  gajiHarian: number;

  @IsString()
  @IsOptional()
  status: boolean;
}

export class KaryawanResponse {
  id: string;

  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  gambar?: string;

  @IsString()
  guid: string;

  @IsString()
  address: string;

  @IsString()
  nip: string;

  @IsString()
  jabatan: string;

  @IsDate()
  birthDate: Date | null;; 

  @IsString()
  phoneNumber: string;

  @IsString()
  role: string;

  @IsString()
  guidUnit: string;

  @IsString()
  unit: string;

  @IsNumber()
  gajiHarian: number;

  @IsString()
  status: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}
