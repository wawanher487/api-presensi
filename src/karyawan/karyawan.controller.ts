import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { CreateKaryawanDto, KaryawanResponse } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { WebResponse } from 'src/model/web.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) {}

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() createKaryawanDto: CreateKaryawanDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<WebResponse<KaryawanResponse>> {
    console.log('Uploaded file:', file?.path);
    try {
      const result = await this.karyawanService.create(createKaryawanDto, file);
      return {
        success: true,
        message: 'Data berhasil disimpan',
        data: result,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('get')
  async findAll(
    @Query('nama') nama?: string,
    @Query('nip') nip?: string,
    @Query('unit') unit?: string,
  ): Promise<WebResponse<KaryawanResponse[]>> {
    try {
      const result = await this.karyawanService.findAll({ nama, nip, unit });
      return {
        success: true,
        message: 'Data berhasil disimpan',
        data: result,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: error.status || HttpStatus.NOT_FOUND,
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/get/:id')
  async findByid(
    @Param('id') id: string,
  ): Promise<WebResponse<KaryawanResponse>> {
    try {
      const result = await this.karyawanService.findById(id);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: error.status || HttpStatus.NOT_FOUND,
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateKaryawanDto: UpdateKaryawanDto,
  ): Promise<WebResponse<KaryawanResponse>> {
    try {
      const result = await this.karyawanService.updateById(
        id,
        updateKaryawanDto,
      );
      return {
        success: true,
        message: 'Data berhasil diperbarui',
        data: result,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: error.status || HttpStatus.BAD_REQUEST,
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.karyawanService.deleteById(id);
      return {
        success: true,
        message: result,
        data: result,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: error.status || HttpStatus.NOT_FOUND,
        },
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}
