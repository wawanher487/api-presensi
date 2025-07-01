import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { HistoryAiService } from './history_ai.service';
import {
  CreateHistoryAiDto,
  HistoryAiResponse,
} from './dto/create-history_ai.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateHistoryAiDto } from './dto/update-history_ai.dto';
import { WebResponse } from 'src/model/web.model';

@Controller('history_ai')
export class HistoryAiController {
  constructor(private readonly historyAiService: HistoryAiService) {}

  @Post('/create')
  async create(
    @Body() createHistoryAiDto: CreateHistoryAiDto,
  ): Promise<WebResponse<HistoryAiResponse>> {
    try {
      const result = await this.historyAiService.create(createHistoryAiDto);
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
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<HistoryAiResponse[]>> {
    try {
      const result = await this.historyAiService.findAll(query);
      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: result.data,
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
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

  @Get('/get/:id')
  async findById(
    @Param('id') id: string,
  ): Promise<WebResponse<HistoryAiResponse>> {
    try {
      const result = await this.historyAiService.findById(id);
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
    @Body() updateHistoryAiDto: UpdateHistoryAiDto,
  ): Promise<WebResponse<HistoryAiResponse>> {
    try {
      const result = await this.historyAiService.updateById(
        id,
        updateHistoryAiDto,
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
  async delelte(@Param('id') id: string) {
    try {
      const result = await this.historyAiService.deleteById(id);
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

  @Get('/range')
  async getRange(@Query() query): Promise<WebResponse<HistoryAiResponse[]>> {
    try {
      const result = await this.historyAiService.findRangeByTanggal(query);
      return {
        success: true,
        message: 'Data berhasil diambil berdasarkan rentang tanggal',
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

  @Get('/top_erly')
  async getTopErly(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<HistoryAiResponse[]>> {
    try {
      const result = await this.historyAiService.findTop5EarlyByTanggal(query);
      return {
        success: true,
        message: 'Data berhasil diambil',
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

  @Get('/status_kehadiran')
  async getKehadiran() {
    try {
      const result = await this.historyAiService.getKehadiranHarian();
      return {
        success: true,
        message: 'Data kehadiran berhasil diambil',
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

  @Get('/riwayat_bulanan')
  async getKehadiranBulananByUser(@Query() query: ExpressQuery) {
    try {
      const result =
        await this.historyAiService.getKehadiranBulananByUser(query);
      return {
        success: true,
        message: 'Data kehadiran berhasil diambil',
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
}
