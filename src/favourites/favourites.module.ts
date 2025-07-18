import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite, FavouritesService, FavouritesController } from '../global-entities';
import { Product } from '../products/products.entity';
import { Lottery } from '../lotteries/lotteries.entity';
import { ProductsModule } from '../products/products.module';
import { LotteriesModule } from '../lotteries/lotteries.module';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favourite, Product, Lottery, User]),
    ProductsModule,
    LotteriesModule,
  ],
  providers: [FavouritesService],
  controllers: [FavouritesController],
})
export class FavouritesModule {} 