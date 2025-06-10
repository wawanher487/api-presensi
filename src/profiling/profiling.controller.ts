import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ProfilingService } from './profiling.service';
import {
  CreateProfilingDto,
  ProfilingResponse,
} from './dto/create-profiling.dto';
import { UpdateProfilingDto } from './dto/update-profiling.dto';
import { WebResponse } from 'src/model/web.model';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('profiling')
export class ProfilingController {
  constructor(private readonly profilingService: ProfilingService) {}

  @Post('/create')
  async create(
    @Body() createProfilingDto: CreateProfilingDto,
  ): Promise<WebResponse<ProfilingResponse>> {
    try {
      const result = await this.profilingService.create(createProfilingDto);
      return {
        success: true,
        message: 'Data berhasil disimpan',
        data: result,
        statuscode: 200,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: 400,
        },
        400,
      );
    }
  }

  @Get('get')
  async findAll(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<ProfilingResponse[]>> {
    try {
      const result = await this.profilingService.findAll(query);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result.data,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        page: result.page,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/userguid/:userGuid')
  async findByUserGuid(
    @Param('userGuid') userGuid: string,
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
  ): Promise<WebResponse<ProfilingResponse[]>> {
    try {
      let result: ProfilingResponse[];

      // Jika ada bulan dan tahun, filter berdasarkan keduanya
      if (bulan && tahun) {
        result = await this.profilingService.findAllUserGuidByMonthYear(
          userGuid,
          bulan,
          tahun,
        );
      } else {
        // Jika tidak ada filter, ambil semua data user
        result = await this.profilingService.findAllUserGuid(userGuid);
      }

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
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getbyid/:id')
  async findById(@Param('id') id: string) {
    try {
      const result = await this.profilingService.findById(id);
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
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProfilingDto: UpdateProfilingDto,
  ): Promise<WebResponse<ProfilingResponse>> {
    try {
      const result = await this.profilingService.updateById(
        id,
        updateProfilingDto,
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
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.profilingService.deleteById(id);
      return {
        success: true,
        message: 'Data berhasil dihapus',
        data: result,
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
