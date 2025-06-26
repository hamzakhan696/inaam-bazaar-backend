import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lottery } from './lotteries.entity';
import { CreateLotteryDto } from './dto/create-lottery.dto';

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(Lottery)
    private lotteryRepo: Repository<Lottery>,
  ) {}

  create(dto: CreateLotteryDto) {
    return this.lotteryRepo.save(dto);
  }

  findAll() {
    return this.lotteryRepo.find();
  }
}
