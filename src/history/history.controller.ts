import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
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
                succes: true,
                message: 'Data berhasil disimpan',
                data: result,
                statuscode: HttpStatus.OK,
            };
        } catch (error) {
            throw new HttpException(
                {
                    succes: false,
                    message: error.message,
                    statuscode: HttpStatus.BAD_REQUEST,
                },
                HttpStatus.BAD_REQUEST,
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
                succes: true,
                message: 'Data berhasil ditemukan',
                data: result.data,
                page: result.page,
                totalPage: result.totalPages,
                totalItems: result.totalItems,
                statuscode: HttpStatus.OK,
            };
        } catch (error) {
            throw new HttpException(
                {
                    succes: false,
                    message: error.message,
                    statuscode: HttpStatus.NOT_FOUND,
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @Get('/get/:id')
    async findById(
        @Param('id') id: string,): Promise<WebResponse<HistoryResponse>> {
        try {
            const result = await this.historyService.findById(id);
            return {
                succes: true,
                message: 'Data berhasil ditemukan',
                data: result,
                statuscode: HttpStatus.OK,
            };
        } catch (error) {
            throw new HttpException(
                {
                    succes: false,
                    message: error.message,
                    statuscode: HttpStatus.NOT_FOUND,
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @Get('/guid/:guid')
    async findByGuid(
        @Param('guid') guid: string,): Promise<WebResponse<HistoryResponse>> {
        try {
            const result = await this.historyService.findByGuid(guid);
            return {
                succes: true,
                message: 'Data berhasil ditemukan',
                data: result,
                statuscode: HttpStatus.OK,
            };
        } catch (error) {
            throw new HttpException(
                {
                    succes: false,
                    message: error.message,
                    statuscode: HttpStatus.NOT_FOUND,
                },
                HttpStatus.NOT_FOUND,
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
                succes: true,
                message: 'Data berhasil diperbarui',
                data: result,
                statuscode: HttpStatus.OK,
            };
        } catch (error) {
            throw new HttpException(
                {
                    succes: false,
                    message: error.message,
                    statuscode: HttpStatus.NOT_FOUND,
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @Delete('/delete/:id')
    async delete(
        @Param('id') id: string,
    ): Promise<WebResponse<null>> {
        try {
            const result = await this.historyService.deleteById(id);
            return {
                succes: true,
                message: 'Data berhasil dihapus',
                data: null,
                statuscode: HttpStatus.OK,
            };
        } catch (error) {
            throw new HttpException(
                {
                    succes: false,
                    message: error.message,
                    statuscode: HttpStatus.NOT_FOUND,
                },
                HttpStatus.NOT_FOUND,
            );
        }
        
    }

}
