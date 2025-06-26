import { Controller, Post, Get, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    dto.images = files?.map(file => file.originalname); // For now, just use originalname
    // Parse productIds if it's a string (from multipart/form-data)
    if (typeof dto.productIds === 'string') {
      try {
        dto.productIds = JSON.parse(dto.productIds);
      } catch {
        dto.productIds = [];
      }
    }
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
