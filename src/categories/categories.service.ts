import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    // Ensure images is an array of strings or empty
    const images = Array.isArray(dto.images) ? dto.images : [];
    const description = dto.description;
    const productIds = Array.isArray(dto.productIds) ? dto.productIds : [];
    return this.categoryRepo.save({ ...dto, images, description, productIds });
  }

  findAll() {
    return this.categoryRepo.find();
  }
}
