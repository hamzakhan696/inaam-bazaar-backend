import { Controller, Post, Get, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    dto.images = files?.map(file => file.originalname);
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
