import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), StorageModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {} 