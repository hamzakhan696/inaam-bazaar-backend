import { Injectable } from '@nestjs/common';
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
} 