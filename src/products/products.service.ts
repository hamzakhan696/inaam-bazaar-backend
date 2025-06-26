import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { Category } from '../categories/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const product = this.productRepo.create({
      ...dto,
      categoryId: category.id,
      category,
    });
    const savedProduct = await this.productRepo.save(product);
    // Add to inventory
    await this.inventoryService.create(
      savedProduct.title,
      savedProduct.images && savedProduct.images.length > 0 ? savedProduct.images[0] : '',
      savedProduct.inventory,
    );
    return savedProduct;
  }

  findAll() {
    return this.productRepo.find({ relations: ['category'] });
  }
}
