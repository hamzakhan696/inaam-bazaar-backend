import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lottery } from './lotteries.entity';
import { LotteryService } from './lotteries.service';
import { LotteryController } from './lotteries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lottery])],
  controllers: [LotteryController],
  providers: [LotteryService],
  exports: [LotteryService],
})
export class LotteriesModule {}
