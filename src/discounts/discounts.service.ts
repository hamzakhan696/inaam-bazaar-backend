import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {}

  create(createDiscountDto: CreateDiscountDto) {
    return this.discountRepository.save(createDiscountDto);
  }

  findAll() {
    return this.discountRepository.find();
  }

  async update(id: number, dto: any) {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) throw new NotFoundException('Discount not found');
    Object.assign(discount, dto);
    return this.discountRepository.save(discount);
  }

  async remove(id: number) {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) throw new NotFoundException('Discount not found');
    await this.discountRepository.remove(discount);
    return { message: 'Discount deleted successfully' };
  }
} 