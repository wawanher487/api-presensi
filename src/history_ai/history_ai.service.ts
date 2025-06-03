import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateHistoryAiDto,
  HistoryAiResponse,
} from './dto/create-history_ai.dto';
import { UpdateHistoryAiDto } from './dto/update-history_ai.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { HistoryAi, HistoryAiDocument } from './schema/history_ai.schema';
import { v4 as uuidv4 } from 'uuid';
import { Query } from 'express-serve-static-core';

@Injectable()
export class HistoryAiService {
  constructor(
    @InjectModel(HistoryAi.name, 'SECONDARY_DB')
    private readonly historyAiModel: Model<HistoryAiDocument>,
  ) {}

  private mapToHistoryAiResponse(historyAi: HistoryAiDocument) {
    return {
      id: historyAi.id.toString(),
      nama: historyAi.nama,
      mood: historyAi.mood,
      keletihan: historyAi.keletihan,
      gambar: historyAi.gambar,
      status_absen: historyAi.status_absen,
      guid: historyAi.guid,
      guid_device: historyAi.guid_device,
      datetime: historyAi.datetime,
      timestamp: historyAi.timestamp,
      unit: historyAi.unit,
      process: historyAi.process,
    };
  }

  async create(
    createHistoryAiDto: CreateHistoryAiDto,
  ): Promise<HistoryAiResponse> {
    const historyAi = await this.historyAiModel.create({
      ...createHistoryAiDto,
      guid: createHistoryAiDto.guid || uuidv4(),
      guid_device: createHistoryAiDto.guid_device || 'CAM-P0721',
      process: createHistoryAiDto.process || 'done',
    });
    return this.mapToHistoryAiResponse(historyAi);
  }

  async findAll(query: Query): Promise<{
    data: HistoryAiResponse[];
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

    // Build filter dynamically
    const filter: any = {};

    // Filter by nama, status_absens, guid_device, unit, and tanggal
    if (query.nama) {
      filter.nama = query.nama;
    }
    if (query.status_absen) {
      filter.status_absen = query.status_absen;
    }
    if (query.unit) {
      filter.unit = query.unit;
    }
    if (query.guid_device) {
      filter.guid_device = query.guid_device;
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

    const totalItems = await this.historyAiModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / resPerPage);

    if (totalPages > 0 && currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }
    const historyAi = await this.historyAiModel
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(resPerPage)
      .exec();

    if (!historyAi || historyAi.length === 0) {
      throw new HttpException(
        'Data berdasarkan filter tersebut tidak ditemukan.',
        404,
      );
    }

    const mapHistoryAi = historyAi.map(this.mapToHistoryAiResponse);

    return {
      data: mapHistoryAi,
      totalItems: totalItems,
      page: currentPage,
      totalPages: totalPages,
    };
  }

  async findById(id: string): Promise<HistoryAiResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }
    const historyAi = await this.historyAiModel.findById(id);
    if (!historyAi) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return this.mapToHistoryAiResponse(historyAi);
  }

  async findByGuid(guid: string): Promise<HistoryAiResponse> {
    const historyAi = await this.historyAiModel.findOne({ guid: guid });
    if (!historyAi) {
      throw new HttpException(`Data dengan guid ${guid} tidak ditemukan.`, 404);
    }
    return this.mapToHistoryAiResponse(historyAi);
  }

  async updateById(
    id: string,
    updateHistoryAiDto: UpdateHistoryAiDto,
  ): Promise<HistoryAiResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }
    const historyAi = await this.historyAiModel.findByIdAndUpdate(
      id,
      updateHistoryAiDto,
      { new: true, runValidators: true },
    );
    if (!historyAi) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return this.mapToHistoryAiResponse(historyAi);
  }

  async deleteById(id: string): Promise<string> {
    const historyAi = await this.historyAiModel.findByIdAndDelete(id);
    if (!historyAi) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return `Data dengan id ${id} berhasil dihapus.`;
  }
}
