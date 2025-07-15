import { Controller, Post, Get, Delete, Param, Body, UploadedFiles, UseInterceptors, Patch } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductService } from '../products/products.service';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly productService: ProductService,
  ) {}

  @Post()
@ApiConsumes('multipart/form-data')
@ApiBody({ type: CreateCategoryDto })
@UseInterceptors(FilesInterceptor('images'))
create(
  @Body() dto: CreateCategoryDto,
  @UploadedFiles() files: Express.Multer.File[],
) {
  dto.images = files;

  // Handle productIds as a string or array
  let productIdsValue: string | number[] = dto.productIds || ''; // Default to empty string if undefined

  // If productIds is an array, convert to string for consistency with form data
  if (Array.isArray(productIdsValue)) {
    productIdsValue = productIdsValue.join(',');
  }

  // Parse comma-separated string into array of numbers
  if (typeof productIdsValue === 'string' && productIdsValue.includes(',')) {
    dto.productIds = productIdsValue.split(',').map(item => {
      const trimmed = item.trim();
      return isNaN(Number(trimmed)) ? null : Number(trimmed);
    }).filter((item): item is number => item !== null); // Type guard
  } else if (typeof productIdsValue === 'string') {
    try {
      const parsed = JSON.parse(productIdsValue);
      dto.productIds = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      dto.productIds = [Number(productIdsValue)];
    }
  } else if (Array.isArray(productIdsValue)) {
    // Explicitly type the array case
    dto.productIds = (productIdsValue as number[]).flatMap(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [Number(item)];
        }
      }
      return [item];
    });
  } else {
    dto.productIds = []; // Default to empty array
  }

  return this.service.create(dto);
}
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Get(':id/products')
  async getCategoryProducts(@Param('id') id: number) {
    const category = await this.service.findOneWithProducts(id);
    if (!category || !category.products) return [];
    return category.products;
  }

  @Patch(':id')
  @ApiBody({ type: CreateCategoryDto })
  async updateCategory(@Param('id') id: number, @Body() dto: CreateCategoryDto) {
    return this.service.update(id, dto);
  }
}
