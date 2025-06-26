import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomColor } from './custom-colors.entity';
import { CustomColorsService } from './custom-colors.service';
import { CustomColorsController } from './custom-colors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomColor])],
  controllers: [CustomColorsController],
  providers: [CustomColorsService],
  exports: [CustomColorsService],
})
export class CustomColorsModule {} 