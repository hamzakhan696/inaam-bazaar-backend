import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Category } from '../categories/categories.entity';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { InventoryModule } from '../inventory/inventory.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), InventoryModule, StorageModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
