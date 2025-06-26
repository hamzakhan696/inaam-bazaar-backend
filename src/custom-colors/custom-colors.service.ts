import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomColor } from './custom-colors.entity';
import { CreateCustomColorDto } from './dto/create-custom-color.dto';

@Injectable()
export class CustomColorsService {
  constructor(
    @InjectRepository(CustomColor)
    private customColorRepo: Repository<CustomColor>,
  ) {}

  create(dto: CreateCustomColorDto) {
    return this.customColorRepo.save(dto);
  }

  findAll() {
    return this.customColorRepo.find();
  }
} 