import { Controller, Post, Get, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    dto.images = files;
    // Always parse inventory as JSON if it's a string or array of strings
    if (typeof dto.inventory === 'string') {
      try {
        dto.inventory = JSON.parse(dto.inventory);
      } catch (e) {
        dto.inventory = [];
      }
    } else if (Array.isArray(dto.inventory)) {
      dto.inventory = dto.inventory.flatMap(item => {
        if (typeof item === 'string') {
          try {
            return [JSON.parse(item)];
          } catch {
            return [];
          }
        }
        return [item];
      });
    }
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
