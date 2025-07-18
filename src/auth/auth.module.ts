import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { FavouritesModule } from '../favourites/favourites.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), UserModule, FavouritesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {} 