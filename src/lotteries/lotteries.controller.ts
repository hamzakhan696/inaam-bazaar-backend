import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LotteryService } from './lotteries.service';
import { CreateLotteryDto } from './dto/create-lottery.dto';

@ApiTags('lotteries')
@Controller('lotteries')
export class LotteryController {
  constructor(private readonly service: LotteryService) {}

  @Post()
  @ApiBody({ type: CreateLotteryDto })
  create(@Body() dto: CreateLotteryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
