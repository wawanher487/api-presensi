import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateKaryawanDto {
  @IsString()
  @IsOptional()
  nama: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  gambar: string;

  @IsString()
  @IsOptional()
  userGuid: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  nip: string;

  @IsString()
  @IsOptional()
  jabatan: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'birthDate harus dalam format DD-MM-YYYY',
  })
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
  @IsOptional()
  gajiHarian: number;

  @IsString()
  @IsOptional()
  status: boolean;
}

export class KaryawanResponse {
  id: string;

  @IsString()
  nama: string;

  @IsString()
  gender: string;

  @IsString()
  gambar?: string;

  @IsString()
  userGuid: string;

  @IsString()
  address: string;

  @IsString()
  nip: string;

  @IsString()
  jabatan: string;

  @IsString()
  birthDate: string;

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
