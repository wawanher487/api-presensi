import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateProfilingDto,
  ProfilingResponse,
} from './dto/create-profiling.dto';
import { UpdateProfilingDto } from './dto/update-profiling.dto';
import { Profiling, ProfilingDocument } from './schema/profiling.schema';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { v4 as uuidv4 } from 'uuid';
import dayjs = require('dayjs');

@Injectable()
export class ProfilingService {
  constructor(
    @InjectModel(Profiling.name, 'SECONDARY_DB')
    private readonly profilingModel: Model<ProfilingDocument>,
  ) {}

  private mapToProfilingResponse(profiling: ProfilingDocument) {
    return {
      id: profiling.id.toString(),
      date: profiling.date,
      guid: profiling.guid,
      userGuid: profiling.userGuid,
      nama: profiling.nama,
      keletihan: profiling.keletihan,
      bahagia: profiling.bahagia,
      sedih: profiling.sedih,
      marah: profiling.marah,
      netral: profiling.netral,
      createdAt: profiling.createdAt,
      updatedAt: profiling.updatedAt,
    };
  }

  async create(
    createProfilingDto: CreateProfilingDto,
  ): Promise<ProfilingResponse> {
    const profiling = await this.profilingModel.create({
      ...createProfilingDto,
      guid: createProfilingDto.guid || uuidv4(),
      userGuid: createProfilingDto.userGuid || uuidv4(),
      date: createProfilingDto.date || dayjs().format('DD-MM-YYYY HH:mm:ss'),
      keletihan: createProfilingDto.keletihan || generateRandomNumber(),
      bahagia: createProfilingDto.bahagia || generateRandomNumber(),
      sedih: createProfilingDto.sedih || generateRandomNumber(),
      marah: createProfilingDto.marah || generateRandomNumber(),
      netral: createProfilingDto.netral || generateRandomNumber(),
    });
    return this.mapToProfilingResponse(profiling);
  }

  async findAll(query: Query): Promise<{
    data: ProfilingResponse[];
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

    const filter: any = {};

    if (query.nama) {
      filter.nama = query.nama;
    }
    if (query.date) {
      filter.date = query.date;
    }
    if (query.userGuid) {
      filter.userGuid = query.userGuid;
    }

    const totalItems = await this.profilingModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / resPerPage);

    if (totalPages > 0 && currentPage > totalPages) {
      throw new HttpException(
        `Halaman ${currentPage} tidak ditemukan. Hanya ada ${totalPages} halaman yang tersedia.`,
        404,
      );
    }

    const profilings = await this.profilingModel
      .find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(resPerPage)
      .exec();

    if (!profilings || profilings.length === 0) {
      throw new HttpException(
        'Data berdasarkan filter tersebut tidak ditemukan.',
        404,
      );
    }

    const data = profilings.map(this.mapToProfilingResponse);

    return {
      data: data,
      totalItems: totalItems,
      totalPages: totalPages,
      page: currentPage,
    };
  }

  async findAllUserGuid(userGuid: string): Promise<ProfilingResponse[]> {
    const profilings = await this.profilingModel
      .find({ userGuid: userGuid })
      .sort({ date: 1 }) // dari yang paling lama ke baru
      .exec(); 

    if (!profilings || profilings.length === 0) {
      throw new HttpException(
        `Data dengan userGuid ${userGuid} tidak ditemukan.`,
        404,
      );
    }

    return profilings.map(this.mapToProfilingResponse);
  }

  async findAllUserGuidByMonthYear(
    userGuid: string,
    bulan: string,
    tahun: string,
  ): Promise<ProfilingResponse[]> {
    const monthYearPattern = `-${bulan.padStart(2, '0')}-${tahun}`; // misal "-06-2025"

    const profilings = await this.profilingModel
      .find({
        userGuid: userGuid,
        date: { $regex: monthYearPattern }, // cari yang mengandung -MM-YYYY
      })
      .sort({ date: 1 }) // dari yang paling lama ke baru
      .exec();

    if (!profilings || profilings.length === 0) {
      throw new HttpException(
        `Data dengan userGuid ${userGuid} untuk bulan ${bulan} dan tahun ${tahun} tidak ditemukan.`,
        404,
      );
    }

    return profilings.map(this.mapToProfilingResponse);
  }

  async findById(id: string): Promise<ProfilingResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }
    const profiling = await this.profilingModel.findById(id);
    if (!profiling) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return this.mapToProfilingResponse(profiling);
  }

  async updateById(
    id: string,
    updateProfilingDto: UpdateProfilingDto,
  ): Promise<ProfilingResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }
    const profiling = await this.profilingModel.findByIdAndUpdate(
      id,
      updateProfilingDto,
      { new: true, runValidators: true },
    );
    if (!profiling) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return this.mapToProfilingResponse(profiling);
  }

  async deleteById(id: string): Promise<string> {
    const profiling = await this.profilingModel.findByIdAndDelete(id);
    if (!profiling) {
      throw new HttpException(`Data dengan id ${id} tidak ditemukan.`, 404);
    }
    return `Profiling dengan id ${id} telah dihapus.`;
  }
}

//untuk generate random number as string
function generateRandomNumber(): number {
  const number = Math.floor(Math.random() * 100) + 1;
  return number;
}
