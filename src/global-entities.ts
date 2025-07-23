// This file is no longer needed. Entities are now defined in their own files and imported in app.module.ts.

import { Category } from "./categories/categories.entity";
import { Lottery } from "./lotteries/lotteries.entity"; 
import { Product } from "./products/products.entity";
import { CustomColor } from "./custom-colors/custom-colors.entity";
import { User } from "./user/user.entity";
import { Inventory } from "./inventory/inventory.entity";
import { Discount } from "./discounts/discount.entity";
import { Deal } from "./deals/deals.entity";
import { Customer } from "./customers/customers.entity";
import { Order } from "./orders/order.entity";
import { OrderItem } from "./orders/order-item.entity";
import { ProductInventory } from "./products/product-inventory.entity";
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Injectable, Controller, Post, Get, Delete, Body, Query, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBody } from '@nestjs/swagger';
import { NotFoundException } from '@nestjs/common';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  itemId: number;

  @Column({ type: 'enum', enum: ['product', 'lottery'] })
  itemType: 'product' | 'lottery';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourite)
    private favouritesRepo: Repository<Favourite>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Lottery)
    private lotteryRepo: Repository<Lottery>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async addFavourite(body: { userId: number; itemId: number; itemType: 'product' | 'lottery' }) {
    const exists = await this.favouritesRepo.findOne({ where: { userId: body.userId, itemId: body.itemId, itemType: body.itemType } });
    if (exists) return exists;
    const fav = this.favouritesRepo.create(body);
    return this.favouritesRepo.save(fav);
  }

  async getFavourites(userId: number) {
    const favs = await this.favouritesRepo.find({ where: { userId } });
    const result: any[] = [];
    for (const fav of favs) {
      let item: any = null;
      if (fav.itemType === 'product') {
        item = await this.productRepo.findOne({ where: { id: fav.itemId } });
      } else if (fav.itemType === 'lottery') {
        item = await this.lotteryRepo.findOne({ where: { id: fav.itemId } });
      }
      result.push({ ...fav, item });
    }
    return result;
  }

  async removeFavourite(id: number) {
    return this.favouritesRepo.delete(id);
  }

  async toggleFavourite(body: { userId: number; itemId: number; itemType: 'product' | 'lottery' }) {
    // Validate user existence
    const user = await this.userRepo.findOne({ where: { id: body.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Validate item existence
    if (body.itemType === 'product') {
      const product = await this.productRepo.findOne({ where: { id: body.itemId } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    } else if (body.itemType === 'lottery') {
      const lottery = await this.lotteryRepo.findOne({ where: { id: body.itemId } });
      if (!lottery) {
        throw new NotFoundException('Lottery not found');
      }
    }
    const exists = await this.favouritesRepo.findOne({ where: { userId: body.userId, itemId: body.itemId, itemType: body.itemType } });
    if (exists) {
      await this.favouritesRepo.delete(exists.id);
    } else {
      const fav = this.favouritesRepo.create(body);
      await this.favouritesRepo.save(fav);
    }
    // Return all favourites for the user (only itemId and itemType)
    const favs = await this.favouritesRepo.find({ where: { userId: body.userId } });
    return favs.map(fav => ({ itemId: fav.itemId, itemType: fav.itemType }));
  }
}

@Controller('favourites')
export class FavouritesController {
  constructor(private readonly service: FavouritesService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        itemId: { type: 'number', example: 10 },
        itemType: { type: 'string', enum: ['product', 'lottery'], example: 'product' }
      },
      required: ['userId', 'itemId', 'itemType']
    }
  })
  add(@Body() body: { userId: number; itemId: number; itemType: 'product' | 'lottery' }) {
    return this.service.addFavourite(body);
  }

  @Get()
  get(@Query('userId') userId: number) {
    return this.service.getFavourites(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.removeFavourite(Number(id));
  }

  @Post('toggle')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        itemId: { type: 'number', example: 10 },
        itemType: { type: 'string', enum: ['product', 'lottery'], example: 'product' }
      },
      required: ['userId', 'itemId', 'itemType']
    }
  })
  async toggle(@Body() body: { userId: number; itemId: number; itemType: 'product' | 'lottery' }) {
    return this.service.toggleFavourite(body);
  }
}

export const entities = [Category, Lottery, Product, CustomColor, User, Inventory, Discount, Deal, Customer, Order, OrderItem, ProductInventory, Favourite];
