import { HttpException, Injectable } from '@nestjs/common';
import { CreateKaryawanDto, KaryawanResponse } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { KaryawanDocument } from './schema/karyawan.schema';
import { v4 as uuidv4 } from 'uuid';
import * as ftp from 'basic-ftp';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class KaryawanService {
  constructor(
    @InjectModel('Karyawan', 'SECONDARY_DB')
    private readonly karyawanModel: Model<KaryawanDocument>,
    private readonly configService: ConfigService,
  ) {}

  private mapToKaryawanResponse(karyawan: KaryawanDocument) {
    return {
      id: karyawan.id.toString(),
      name: karyawan.name,
      gender: karyawan.gender,
      gambar: karyawan.gambar,
      guid: karyawan.guid,
      address: karyawan.address,
      jabatan: karyawan.jabatan,
      nip: karyawan.nip,
      birthDate: karyawan.birthDate ? new Date(karyawan.birthDate) : null,
      phoneNumber: karyawan.phoneNumber,
      role: karyawan.role,
      guidUnit: karyawan.guidUnit,
      unit: karyawan.unit,
      gajiHarian: karyawan.gajiHarian,
      status: karyawan.status,
      createdAt: karyawan.createdAt,
      updatedAt: karyawan.updatedAt,
    };
  }

  async uploadToFTP(
    localPath: string,
    remoteFileName: string,
  ): Promise<string> {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
      await client.access({
        host: this.configService.get<string>('FTP_HOST'), // <-- Ambil dari config
        port: this.configService.get<number>('FTP_PORT'), // <-- Ambil dari config
        user: this.configService.get<string>('FTP_USER'), // <-- Ambil dari config
        password: this.configService.get<string>('FTP_PASSWORD'), // <-- Ambil dari config
        secure: false,
      });

      const remotePath = `/presensi/${remoteFileName}`;
      console.log('🚀 Upload ke FTP:', localPath, '->', remotePath);
      await client.uploadFrom(localPath, remotePath);
      console.log('✅ Upload ke FTP berhasil:', remotePath);

      // Hapus file lokal setelah upload
      fs.unlinkSync(localPath);

      return remotePath;
    } catch (error) {
      throw new HttpException(
        `Gagal upload gambar ke FTP: ${error.message}`,
        500,
      );
    } finally {
      client.close();
    }
  }

  // private async sendToAIService(data: {
  //   guid: string;
  //   name: string;
  //   imagePath: string;
  // }) {
  //   try {
  //     const url = this.configService.get<string>('AI_URL') + '/train';
  //     await axios.post(url, data);
  //     console.log('Data berhasil dikirim ke AI Service');
  //   } catch (error) {
  //     console.error('Gagal kirim ke AI Service:', error.message);
  //   }
  // }

  private generateRandomNIP(): string {
    return Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  }

  async create(
    createKaryawanDto: CreateKaryawanDto,
    file?: Express.Multer.File,
  ): Promise<KaryawanResponse> {
    let gambarPath = '';

    // Gunakan guid atau generate baru
    const guid = uuidv4();

    // Jika ada file yang diupload
    if (file) {
      const safeNama = createKaryawanDto.name
        .toLowerCase()
        .replace(/\s+/g, '_');
      const uniqueFileName = `${guid}_${safeNama}.jpg`;
      gambarPath = await this.uploadToFTP(file.path, uniqueFileName); // contoh hasil: "/presensi/abc123-17206-foto.jpg"
    }

    const karyawan = await this.karyawanModel.create({
      name: createKaryawanDto.name || 'budi',
      gender: createKaryawanDto.gender || 'L',
      gambar: gambarPath || '/presensi/default.jpg',
      address: createKaryawanDto.address || 'belum diisi',
      jabatan: createKaryawanDto.jabatan || 'belum diisi',
      nip: createKaryawanDto.nip || this.generateRandomNIP(),
      birthDate: createKaryawanDto.birthDate || undefined,
      phoneNumber: createKaryawanDto.phoneNumber || '323424234',
      role: createKaryawanDto.role || 'user',
      guidUnit: createKaryawanDto.guidUnit || uuidv4(),
      unit: createKaryawanDto.unit || 'magang',
      guid,
      gajiHarian: createKaryawanDto.gajiHarian || 0,
      status: createKaryawanDto.status ?? true,
    });

    // Kirim ke AI jika ada gambar yang diupload
    // if (gambarPath) {
    //   await this.sendToAIService({
    //     guid,
    //     name: createKaryawanDto.name,
    //     imagePath: gambarPath,
    //   });
    // }
    // if (file) {
    //   console.log('PATH FILE YANG AKAN DIUPLOAD:', file.path);
    // }

    return this.mapToKaryawanResponse(karyawan);
  }

  // karyawan.service.ts
  async findAll(filterDto?: {
    name?: string;
    nip?: string;
    unit?: string;
  }): Promise<KaryawanResponse[]> {
    const query: any = {};

    if (filterDto?.name) {
      query.name = { $regex: filterDto.name, $options: 'i' }; // case-insensitive
    }

    if (filterDto?.nip) {
      query.nip = { $regex: filterDto.nip, $options: 'i' };
    }

    if (filterDto?.unit) {
      query.unit = { $regex: filterDto.unit, $options: 'i' };
    }

    const karyawans = await this.karyawanModel.find(query).exec();
    return karyawans.map((karyawan) => this.mapToKaryawanResponse(karyawan));
  }

  async findById(id: string): Promise<KaryawanResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }

    const karyawan = await this.karyawanModel.findById(id).exec();
    if (!karyawan) {
      throw new HttpException(`Karyawan dengan ID ${id} tidak ditemukan.`, 404);
    }
    return this.mapToKaryawanResponse(karyawan);
  }

  async updateById(
    id: string,
    updateKaryawanDto: UpdateKaryawanDto,
  ): Promise<KaryawanResponse> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        `Parameter ${id} tidak valid atau tidak ditemukan.`,
        400,
      );
    }
    const karyawan = await this.karyawanModel.findByIdAndUpdate(
      id,
      updateKaryawanDto,
      { new: true, runValidators: true },
    );
    if (!karyawan) {
      throw new HttpException(`Karyawan dengan ID ${id} tidak ditemukan.`, 404);
    }
    return this.mapToKaryawanResponse(karyawan);
  }

  async deleteById(id: string): Promise<string> {
    const karyawan = await this.karyawanModel.findByIdAndDelete(id);
    if (!karyawan) {
      throw new HttpException(`Karyawan dengan ID ${id} tidak ditemukan.`, 404);
    }
    return `Karyawan dengan ID ${id} telah dihapus.`;
  }
}
