import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History } from './schema/history.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateHistoryDto, HistoryResponse } from './dto/create_history.dto';
import { Query } from 'express-serve-static-core';
import { v4 as uuidv4 } from 'uuid';
import { UpdateHistoryDto } from './dto/update_history.dto';

@Injectable()
export class HistoryService {
    constructor(@InjectModel(History.name) private model: Model<History>) { }

    private mapToHistoryResponse(history: History): HistoryResponse {
        return {
            id: history.id.toString(),
            guid: history.guid,
            guid_device: history.guid_device,
            datetime: history.datetime,
            timestamp: history.timestamp,
            gambar: history.value,
            unit: history.unit,
            process: history.process,
            checkStatus: history.checkStatus
        };
    }

    async create(createHistoryDto: CreateHistoryDto): Promise<HistoryResponse> {
        const history = await this.model.create({
            ...createHistoryDto,
            guid: uuidv4()
        });
        return this.mapToHistoryResponse(history);

    }

    async findAll(query: Query): Promise<{ data: HistoryResponse[], totalItems: number, totalPages: number, page: number }> {
        const resPerPage = 10;
        // Validasi parameter `page`
        if (!query.page || isNaN(Number(query.page))) {
            throw new HttpException(
                `Parameter 'page' tidak valid atau tidak ditemukan.`,
                400,
            );
        }

        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const totalItems = await this.model.countDocuments();
        const totalPages = Math.ceil(totalItems / resPerPage);
        if (currentPage > totalPages) {
            throw new HttpException(
                `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
                404,
            );
        }

        const history = await this.model.find().limit(resPerPage).skip(skip).exec();

        const mapHistory = history.map(this.mapToHistoryResponse);

        return {
            data: mapHistory,
            totalItems: totalItems,
            page: currentPage,
            totalPages: totalPages,
        }
    }

    async findById(id: string): Promise<HistoryResponse>{
        if (!isValidObjectId(id)) {
            throw new HttpException(
                `Parameter ${id} tidak valid atau tidak ditemukan.`,
                400,
            );
        }
        const history = await this.model.findById(id);
        if(!history){
            throw new HttpException(
                `Data dengan id ${id} tidak ditemukan.`,
                404,
            );
        }
        return this.mapToHistoryResponse(history);
    }

    async findByGuid(guid: string): Promise<HistoryResponse>{
        const history = await this.model.findOne({guid: guid});
        if(!history){
            throw new HttpException(
                `Data dengan guid ${guid} tidak ditemukan.`,
                404,
            );
        }
        return this.mapToHistoryResponse(history);
    }

    async updateById(
        id: string,
        updateHistoryDto: UpdateHistoryDto,
    ): Promise<HistoryResponse> {
        if (!isValidObjectId(id)) {
            throw new HttpException(
                `Parameter ${id} tidak valid atau tidak ditemukan.`,
                400,
            );
        }
        const history = await this.model.findByIdAndUpdate(id, updateHistoryDto, { new: true, runValidators: true });
        if(!history){
            throw new HttpException(
                `Data dengan id ${id} tidak ditemukan.`,
                404,
            );
        }
        return this.mapToHistoryResponse(history);
    }

    async deleteById(id: string): Promise<string> {
        const history = await this.model.findByIdAndDelete(id);
        if(!history){
            throw new HttpException(
                `Data dengan id ${id} tidak ditemukan.`,
                404,
            );
        }
        return 'Data berhasil dihapus';
    }
}
