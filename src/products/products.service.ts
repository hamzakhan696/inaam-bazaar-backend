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
        if (inv && inv.size && inv.quantity) {
          const record = new ProductInventory();
          record.size = inv.size;
          record.quantity = inv.quantity;
          record.product = savedProduct;
          await this.productRepo.manager.save(record);
        }
      }
    }

    // Add summary to main inventory table
    await this.inventoryService.create(
      savedProduct.title,
      savedProduct.images && savedProduct.images.length > 0 ? savedProduct.images[0] : '',
      savedProduct.totalQuantity
    );

    return savedProduct;
  }

  findAll() {
    return this.productRepo.find({ relations: ['category', 'inventory'] });
  }

  findOne(id: number) {
    return this.productRepo.findOne({ where: { id }, relations: ['category', 'inventory'] });
  }

  async update(id: number, dto: CreateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Delete from inventory table as well
    await this.inventoryService.deleteByProductName(product.title);

    // Remove productId from all categories' productIds arrays
    const categories = await this.categoryRepo.find();
    for (const category of categories) {
      if (Array.isArray(category.productIds) && category.productIds.includes(id)) {
        category.productIds = category.productIds.filter(pid => pid !== id);
        await this.categoryRepo.save(category);
      }
    }

    await this.productRepo.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async findByIds(ids: number[]) {
    if (!ids || !ids.length) return [];
    return this.productRepo.findByIds(ids);
  }
}
