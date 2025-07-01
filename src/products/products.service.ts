import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { Category } from '../categories/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { InventoryService } from '../inventory/inventory.service';
import { StorageService } from '../storage/storage.service';
import { ProductInventory } from './product-inventory.entity';

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
    // Remove inventory from dto before saving product
    const { inventory, ...rest } = dto;
    let totalQuantity = 0;
    if (Array.isArray(inventory)) {
      totalQuantity = inventory.reduce((sum, inv) => sum + (Number(inv.quantity) || 0), 0);
    }
    const productData = {
      ...rest,
      categoryId: category.id,
      category,
      images: imagePaths,
      totalQuantity,
    };
    const savedProduct = await this.productRepo.save(productData);

    // Save inventory records with product relation
    if (Array.isArray(inventory)) {
      for (const inv of inventory) {
        const record = new ProductInventory();
        record.size = inv.size;
        record.quantity = inv.quantity;
        record.product = savedProduct;
        await this.productRepo.manager.save(record);
      }
    }
    return savedProduct;
  }

  findAll() {
    return this.productRepo.find({ relations: ['category', 'inventory'] });
  }

  findOne(id: number) {
    return this.productRepo.findOne({ where: { id }, relations: ['category', 'inventory'] });
  }
}
