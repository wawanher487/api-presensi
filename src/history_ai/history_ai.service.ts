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
import dayjs = require('dayjs');

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
      userGuid: historyAi.userGuid,
      guid: historyAi.guid,
      guid_device: historyAi.guid_device,
      datetime: historyAi.datetime,
      timestamp: historyAi.timestamp,
      unit: historyAi.unit,
      process: historyAi.process,
      jam_masuk: historyAi.jam_masuk,
      jam_keluar: historyAi.jam_keluar,
      jam_masuk_actual: historyAi.jam_masuk_actual,
      jam_keluar_actual: historyAi.jam_keluar_actual,
      jumlah_telat: historyAi.jumlah_telat,
      total_jam_telat: historyAi.total_jam_telat,
      createdAt: historyAi.createdAt,
      updatedAt: historyAi.updatedAt,
    };
  }

  async create(
    createHistoryAiDto: CreateHistoryAiDto,
  ): Promise<HistoryAiResponse> {
    const tanggalHariIni = dayjs(
      createHistoryAiDto.datetime,
      'DD-MM-YYYY HH:mm:ss',
    ).format('YYYY-MM-DD');
    const userGuid = createHistoryAiDto.guid;
    const statusAbsen = createHistoryAiDto.status_absen;

    // Cek apakah sudah ada absensi dengan status yang sama hari ini
    const existing = await this.historyAiModel.findOne({
      userGuid: userGuid,
      status_absen: statusAbsen,
      datetime: {
        $regex: new RegExp(`^${dayjs(tanggalHariIni).format('DD-MM-YYYY')}`), // cari berdasarkan tanggal string
      },
    });

    if (existing) {
      throw new HttpException(
        `Karyawan sudah melakukan absensi '${statusAbsen}' pada tanggal ini.`,
        400,
      );
    }

    // 👇 Simpan jika belum ada
    const historyAi = await this.historyAiModel.create({
      ...createHistoryAiDto,
      userGuid: userGuid,
      guid: createHistoryAiDto.guid || uuidv4(),
      guid_device: createHistoryAiDto.guid_device || 'CAM-P0721',
      process: createHistoryAiDto.process || 'done',
      keletihan: createHistoryAiDto.keletihan || generateRandomNumber(),
      datetime:
        createHistoryAiDto.datetime || dayjs().format('DD-MM-YYYY HH:mm:ss'),
      timestamp: createHistoryAiDto.timestamp || Math.floor(Date.now() / 1000),
      unit: createHistoryAiDto.unit || 'tamu',
      jam_masuk: createHistoryAiDto.jam_masuk || '08:00:00',
      jam_masuk_actual:
        createHistoryAiDto.jam_masuk_actual || dayjs().format('HH:mm:ss'),
      jam_keluar: createHistoryAiDto.jam_keluar || '17:00:00',
      jam_keluar_actual:
        createHistoryAiDto.jam_keluar_actual || dayjs().format('HH:mm:ss'),
      jumlah_telat: createHistoryAiDto.jumlah_telat || 0,
      total_jam_telat: createHistoryAiDto.total_jam_telat || 0,
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

  async findRangeByTanggal(query: Query): Promise<HistoryAiResponse[]> {
    const { start, end } = query;

    if (!start || !end) {
      throw new HttpException('Parameter start dan end wajib diisi', 400);
    }

    // Parsing tanggal start dan end: format DD-MM-YYYY
    const [d1, m1, y1] = (start as string).split('-').map(Number);
    const [d2, m2, y2] = (end as string).split('-').map(Number);

    if (!d1 || !m1 || !y1 || !d2 || !m2 || !y2) {
      throw new HttpException('Format tanggal harus DD-MM-YYYY', 400);
    }

    const startDate = new Date(y1, m1 - 1, d1, 0, 0, 0);
    const endDate = new Date(y2, m2 - 1, d2, 23, 59, 59);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const data = await this.historyAiModel
      .find({
        timestamp: { $gte: startTimestamp, $lte: endTimestamp },
      })
      .sort({ timestamp: 1 });

    if (!data || data.length === 0) {
      throw new HttpException(
        'Data tidak ditemukan pada rentang tanggal ini.',
        404,
      );
    }

    return data.map(this.mapToHistoryAiResponse);
  }

  async findTop5EarlyByTanggal(query: Query): Promise<HistoryAiResponse[]> {
    const { tanggal } = query;

    if (!tanggal || typeof tanggal !== 'string') {
      throw new HttpException(
        'Parameter tanggal wajib diisi dalam format DD-MM-YYYY',
        400,
      );
    }

    const [day, month, year] = tanggal.split('-').map(Number);
    if (!day || !month || !year) {
      throw new HttpException('Format tanggal harus DD-MM-YYYY', 400);
    }

    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const result = await this.historyAiModel
      .find({
        timestamp: { $gte: startTimestamp, $lte: endTimestamp },
        jam_masuk_actual: { $ne: null },
        userGuid: { $nin: ['unknown', 'error'] },
      })
      .sort({ jam_masuk_actual: 1 })
      .limit(5)
      .exec();

    if (!result || result.length === 0) {
      throw new HttpException(
        `Tidak ada data absensi pada tanggal ${tanggal}`,
        404,
      );
    }

    return result.map(this.mapToHistoryAiResponse);
  }

  async getKehadiranHarian() {
    const startOfToday = dayjs().startOf('day').unix(); // 00:00 hari ini
    const endOfToday = dayjs().endOf('day').unix(); // 23:59 hari ini

    const dataHariIni = await this.historyAiModel.find({
      timestamp: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    // Hitung berdasarkan status_absen dan keterlambatan
    let totalHadir = 0;
    let totalTidakHadir = 0;
    let totalTelat = 0;

    for (const data of dataHariIni) {
      if (data.status_absen === 'hadir') {
        totalHadir++;
      } else if (data.status_absen === 'terlambat') {
        totalTelat++;
      } else if (data.status_absen === 'tidak hadir') {
        totalTidakHadir++;
      }
    }

    return {
      tanggal: dayjs().format('DD-MM-YYYY'),
      totalHadir,
      totalTelat,
      totalTidakHadir,
    };
  }
}

//untuk generate random number as string
function generateRandomNumber(): number {
  const number = Math.floor(Math.random() * 100) + 1;
  return number;
}
