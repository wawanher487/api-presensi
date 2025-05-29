import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from "class-validator";


export class UpdateHistoryDto {
    @IsOptional()
    @IsString()
    datetime: string;
  
    @IsOptional()
    @IsNumber()
    timestamp: number;
  
    @IsOptional()
    @IsString()
    gambar: string;
  
    @IsOptional()
    @IsString()
    guid_device: string;
  
    @IsOptional()
    guid: string;
  
    @IsOptional()
    @IsString()
    unit: string;
  
    @IsOptional()
    @IsBoolean()
    process?: boolean;
  
    @IsOptional()
    @IsBoolean()
    checkStatus?: boolean;
}
