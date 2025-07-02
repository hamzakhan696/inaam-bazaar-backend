import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { StorageService } from '../storage/storage.service'; // Import StorageService

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    private readonly storageService: StorageService, // Inject StorageService
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const imagePaths: string[] = [];
  
    if (dto.images && Array.isArray(dto.images)) {
      for (const image of dto.images) {
        const imagePath = await this.storageService.uploadFile(image, 'category_images');
        imagePaths.push(imagePath);
      }
    }
  
    const categoryData = {
      name: dto.name,
      description: dto.description || '',
      productIds: Array.isArray(dto.productIds) ? dto.productIds : [], // Ensure productIds is always an array
      images: imagePaths,
    };
  
    const category = this.categoryRepo.create(categoryData);
    return await this.categoryRepo.save(category);
  } 

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  // Optional: Method to update category images
  async updateCategoryImages(categoryId: number, images: Express.Multer.File[]): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Delete existing images from MinIO if necessary
    if (category.images && category.images.length > 0) {
      for (const imagePath of category.images) {
        await this.storageService.deleteFile(imagePath);
      }
    }

    // Upload new images
    const imagePaths: string[] = [];
    for (const image of images) {
      const imagePath = await this.storageService.uploadFile(image, 'category_images');
      imagePaths.push(imagePath);
    }

    // Update the category with new image paths
    category.images = imagePaths;
    return await this.categoryRepo.save(category);
  }

  // Optional: Method to delete a specific image
  async deleteCategoryImage(categoryId: number, imagePath: string): Promise<{ message: string }> {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.images.includes(imagePath)) {
      await this.storageService.deleteFile(imagePath);
      category.images = category.images.filter((path) => path !== imagePath);
      await this.categoryRepo.save(category);
    }

    return { message: 'Image deleted successfully' };
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepo.remove(category);
    return { message: 'Category deleted successfully' };
  }
}