import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateKaryawanDto {
  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  gambar?: string;

  @IsString()
  @IsOptional()
  userGuid?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  nip?: string;

  @IsString()
  @IsOptional()
  jabatan?: string;

  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'birthDate harus dalam format DD-MM-YYYY',
  })
  birthDate?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  guidUnit?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  gajiHarian?: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
