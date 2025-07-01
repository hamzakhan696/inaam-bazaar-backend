import { Controller, Post, Get, Delete, Param, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
    dto.images = files;

    // Robust productIds parsing
    if (typeof dto.productIds === 'string') {
      // Single value as string
      try {
        const parsed = JSON.parse(dto.productIds);
        dto.productIds = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        dto.productIds = [Number(dto.productIds)];
      }
    } else if (Array.isArray(dto.productIds)) {
      // Array of strings or numbers
      dto.productIds = dto.productIds.flatMap(item => {
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
    } else if (typeof dto.productIds === 'number') {
      dto.productIds = [dto.productIds];
    } else {
      dto.productIds = [];
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
}
