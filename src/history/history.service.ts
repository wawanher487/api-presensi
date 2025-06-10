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
  constructor(@InjectModel(History.name) private model: Model<History>) {}

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
      checkStatus: history.checkStatus,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    };
  }

  async create(createHistoryDto: CreateHistoryDto): Promise<HistoryResponse> {
    const history = await this.model.create({
      ...createHistoryDto,
      guid: uuidv4(),
    });
    return this.mapToHistoryResponse(history);
  }

  async findAll(query: Query): Promise<{
    data: HistoryResponse[];
    totalItems: number;
    totalPages: number;
    page: number;
  }> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    if (currentPage < 1) {
      throw new HttpException('Halaman tidak boleh kurang dari 1', 400);
    }

    //build filter dinamis
    const filter: any = {};

    //filter berdasarkan guid_device, unit, dan tanggal
    if (query.guid_device) {
      filter.guid_device = query.guid_device;
    }
    if (query.unit) {
      filter.unit = query.unit;
    }
    if (query.tanggal && typeof query.tanggal === 'string') {
      //parse tanggal dari query format "DD-MM-YYYY"
      const [day, month, year] = query.tanggal.split('-').map(Number);
      if (!day || !month || !year) {
        throw new HttpException(
          'Format tanggal tidak valid, gunakan DD-MM-YYYY',
          400,
        );
      }

      //buat tanggal mulai dan akhir
      const startDate = new Date(year, month - 1, day, 0, 0, 0);
      const endDate = new Date(year, month - 1, day, 23, 59, 59);

      //rentang timestamp unix detik
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      filter.timestamp = {
        $gte: startTimestamp,
        $lte: endTimestamp,
      };
    }

    const totalItems = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / resPerPage);

    if (totalPages > 0 && currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }

    const history = await this.model
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(resPerPage)
      .exec();

    if (!history || history.length === 0) {
      throw new HttpException('Data berdasarkan filter tersebut tidak ditemukan.', 404);
    }

    const mapHistory = history.map(this.mapToHistoryResponse);

    return {
      data: mapHistory,
      totalItems: totalItems,
      page: currentPage,
      totalPages: totalPages,
    };
  }

  async findById(id: string): Promise<HistoryResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }
    const history = await this.model.findById(id);
    if (!history) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return this.mapToHistoryResponse(history);
  }

  async findByGuid(guid: string): Promise<HistoryResponse> {
    const history = await this.model.findOne({ guid: guid });
    if (!history) {
      throw new HttpException(`Data dengan guid ${guid} tidak ditemukan.`, 404);
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
    const history = await this.model.findByIdAndUpdate(id, updateHistoryDto, {
      new: true,
      runValidators: true,
    });
    if (!history) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return this.mapToHistoryResponse(history);
  }

  async deleteById(id: string): Promise<string> {
    const history = await this.model.findByIdAndDelete(id);
    if (!history) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return `Data dengan id ${id} berhasil dihapus.`;
  }
}
