import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lottery } from './lotteries.entity';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(Lottery)
    private lotteryRepo: Repository<Lottery>,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateLotteryDto) {
    const imagePaths: string[] = [];
    if (dto.images && Array.isArray(dto.images)) {
      for (const image of dto.images) {
        const imagePath = await this.storageService.uploadFile(image, 'lottery_images');
        imagePaths.push(imagePath);
      }
    }
    const lotteryData = {
      ...dto,
      images: imagePaths,
    };
    return this.lotteryRepo.save(lotteryData);
  }

  findAll() {
    return this.lotteryRepo.find();
  }

  findOne(id: number) {
    return this.lotteryRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: any) {
    const lottery = await this.lotteryRepo.findOne({ where: { id } });
    if (!lottery) throw new NotFoundException('Lottery not found');
    Object.assign(lottery, dto);
    return this.lotteryRepo.save(lottery);
  }

  async remove(id: number) {
    const lottery = await this.lotteryRepo.findOne({ where: { id } });
    if (!lottery) throw new NotFoundException('Lottery not found');
    await this.lotteryRepo.remove(lottery);
    return { message: 'Lottery deleted successfully' };
  }

  async updateStatus(id: number, status: 'active' | 'inactive') {
    const lottery = await this.lotteryRepo.findOne({ where: { id } });
    if (!lottery) throw new NotFoundException('Lottery not found');
    lottery.status = status;
    return this.lotteryRepo.save(lottery);
  }
}
