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

  // Helper method to process image URLs
  private async processImageUrls(images: { url: string, color: string }[]): Promise<{ url: string, color: string }[]> {
    if (!images || !Array.isArray(images)) return [];
    
    const processedImages: { url: string, color: string }[] = [];
    for (const image of images) {
      try {
        // Convert file path to permanent public URL (doesn't expire)
        const imageUrl = await this.storageService.getPublicUrl(image.url);
        processedImages.push({
          url: imageUrl,
          color: image.color || ''
        });
      } catch (error) {
        console.error(`Failed to process image URL: ${image.url}`, error);
        // Keep original URL if processing fails
        processedImages.push(image);
      }
    }
    return processedImages;
  }

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
    // Map images and colors
    const imagesWithColors = imagePaths.map((url, idx) => ({
      url,
      color: dto.colors && dto.colors[idx] ? dto.colors[idx] : '',
    }));
    // Remove inventory from dto before saving product
    const { inventory, ...rest } = dto;
    let totalQuantity = 0;
    if (Array.isArray(inventory)) {
      totalQuantity = inventory.reduce((sum, inv) => sum + (Number(inv.quantity) || 0), 0);
    }
    let isArrival = false;
    if (typeof dto.isArrival === 'string' && dto.isArrival) {
      isArrival = (dto.isArrival as string).toLowerCase() === 'true';
    } else if (typeof dto.isArrival === 'boolean') {
      isArrival = dto.isArrival;
    }
    const productData = {
      ...rest,
      categoryId: category.id,
      category,
      images: imagesWithColors,
      totalQuantity,
      isArrival,
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
      savedProduct.images && savedProduct.images.length > 0 ? savedProduct.images[0].url : '',
      savedProduct.totalQuantity
    );

    return savedProduct;
  }

  async findAll() {
    const products = await this.productRepo.find({ relations: ['category', 'inventory'] });
    
    // Process image URLs for all products
    const processedProducts = await Promise.all(
      products.map(async (product) => {
        if (product.images) {
          product.images = await this.processImageUrls(product.images);
        }
        return product;
      })
    );
    
    return processedProducts;
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({ where: { id }, relations: ['category', 'inventory'] });
    
    if (product && product.images) {
      product.images = await this.processImageUrls(product.images);
    }
    
    return product;
  }

  async update(id: number, dto: CreateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Preserve old images if not updating
    let newImages = product.images || [];
    if (dto.images && Array.isArray(dto.images) && dto.images.length > 0) {
      // Upload new images
      const imagePaths: string[] = [];
      for (const image of dto.images) {
        const imagePath = await this.storageService.uploadFile(image, 'product_images');
        imagePaths.push(imagePath);
      }
      // Map new images with colors
      let colors: string[] = [];
      if (Array.isArray(dto.colors)) {
        colors = dto.colors as string[];
      } else if (typeof dto.colors === 'string') {
        colors = (dto.colors as string).split(',').map(c => c.trim());
      }
      newImages = imagePaths.map((url, idx) => ({
        url,
        color: colors[idx] || '',
      }));
    }
    // If no new images provided, keep the old images
    // (already handled by initializing newImages above)

    // Update product data while preserving images if no new ones provided
    const updateData: any = {
      ...dto,
      images: newImages,
    };

    // Remove inventory from update data as it's handled separately
    if (updateData.inventory) {
      updateData.inventory = undefined;
    }

    Object.assign(product, updateData);
    const updatedProduct = await this.productRepo.save(product);

    // Process image URLs for response
    if (updatedProduct.images) {
      updatedProduct.images = await this.processImageUrls(updatedProduct.images);
    }

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Delete from inventory table as well
    await this.inventoryService.deleteByProductName(product.title);

    // Remove productId from all categories' productIds arrays
    // (No longer needed, as ORM relation handles this)

    await this.productRepo.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async findByIds(ids: number[]) {
    if (!ids || !ids.length) return [];
    const products = await this.productRepo.findByIds(ids);
    
    // Process image URLs for all products
    const processedProducts = await Promise.all(
      products.map(async (product) => {
        if (product.images) {
          product.images = await this.processImageUrls(product.images);
        }
        return product;
      })
    );
    
    return processedProducts;
  }

  async findByArrival(isArrival: boolean) {
    const products = await this.productRepo.find({ where: { isArrival }, relations: ['category', 'inventory'] });
    
    // Process image URLs for all products
    const processedProducts = await Promise.all(
      products.map(async (product) => {
        if (product.images) {
          product.images = await this.processImageUrls(product.images);
        }
        return product;
      })
    );
    
    return processedProducts;
  }
}
