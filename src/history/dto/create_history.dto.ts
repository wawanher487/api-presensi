import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  datetime: string;

  @IsNumber()
  @IsOptional()
  timestamp: number;

  @IsNotEmpty()
  @IsString()
  gambar: string;

  @IsString()
  @IsNotEmpty()
  guid_device: string;

  @IsUUID()
  @IsOptional()
  guid: string;

  @IsOptional()
  unit: string;

  @IsOptional()
  @IsBoolean()
  process?: boolean;

  @IsOptional()
  @IsBoolean()
  checkStatus?: boolean;
}

export class HistoryResponse {
  id: string;

  @IsString()
  datetime: string;

  @IsNumber()
  timestamp: number;

  @IsString()
  gambar: string;

  @IsString()
  guid_device: string;

  @IsString()
  guid: string;

  @IsString()
  unit: string;

  @IsBoolean()
  process?: boolean;

  @IsBoolean()
  checkStatus?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}
