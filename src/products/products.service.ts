import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { Category } from '../categories/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { InventoryService } from '../inventory/inventory.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    private readonly inventoryService: InventoryService,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const imagePaths: string[] = [];
    if (dto.images && Array.isArray(dto.images)) {
      for (const image of dto.images) {
        const imagePath = await this.storageService.uploadFile(image, 'product_images');
        imagePaths.push(imagePath);
      }
    }
    const productData = {
      ...dto,
      categoryId: category.id,
      category,
      images: imagePaths,
    };
    const savedProduct = await this.productRepo.save(productData);
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
