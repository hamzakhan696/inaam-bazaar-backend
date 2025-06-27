import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './deals.entity';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Deal]), StorageModule],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {} 