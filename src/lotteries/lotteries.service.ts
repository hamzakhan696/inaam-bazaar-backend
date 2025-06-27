import { Injectable } from '@nestjs/common';
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
}
