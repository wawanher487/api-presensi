import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { WebResponse } from 'src/model/web.model';
import { CreateHistoryDto, HistoryResponse } from './dto/create_history.dto';
import { HistoryService } from './history.service';
import { UpdateHistoryDto } from './dto/update_history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('/create')
  async create(
    @Body() createHistoryDto: CreateHistoryDto,
  ): Promise<WebResponse<HistoryResponse>> {
    try {
      const result = await this.historyService.create(createHistoryDto);
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
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/get')
  async findAll(
    @Query() query: ExpressQuery,
  ): Promise<WebResponse<HistoryResponse[]>> {
    try {
      const result = await this.historyService.findAll(query);
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
  ): Promise<WebResponse<HistoryResponse>> {
    try {
      const result = await this.historyService.findById(id);
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

  @Get('/guid/:guid')
  async findByGuid(
    @Param('guid') guid: string,
  ): Promise<WebResponse<HistoryResponse>> {
    try {
      const result = await this.historyService.findByGuid(guid);
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
  async updateById(
    @Param('id') id: string,
    @Body() updateHistoryDto: UpdateHistoryDto,
  ): Promise<WebResponse<HistoryResponse>> {
    try {
      const result = await this.historyService.updateById(id, updateHistoryDto);
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
  async delete(@Param('id') id: string) {
    try {
      const result = await this.historyService.deleteById(id);
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
          statuscode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
