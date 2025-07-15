import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deals.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    private storageService: StorageService,
  ) {}

  async create(createDealDto: CreateDealDto, files: Express.Multer.File[]): Promise<Deal> {
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map(file => this.storageService.uploadFile(file, 'deals'))
      );
    }
    const deal = this.dealRepository.create({
      ...createDealDto,
      images: imageUrls,
    });
    return this.dealRepository.save(deal);
  }

  findAll() {
    return this.dealRepository.find();
  }

  async update(id: number, dto: any) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    Object.assign(deal, dto);
    return this.dealRepository.save(deal);
  }

  async remove(id: number) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    await this.dealRepository.remove(deal);
    return { message: 'Deal deleted successfully' };
  }
} 