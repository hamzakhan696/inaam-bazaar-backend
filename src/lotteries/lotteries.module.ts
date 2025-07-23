import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lottery } from './lotteries.entity';
import { LotteryService } from './lotteries.service';
import { LotteryController } from './lotteries.controller';
import { StorageModule } from '../storage/storage.module';
import { Winner } from './lotteries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lottery, Winner]), StorageModule],
  controllers: [LotteryController],
  providers: [LotteryService],
  exports: [LotteryService],
})
export class LotteriesModule {}
