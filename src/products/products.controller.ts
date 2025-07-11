import { Controller, Post, Get, Patch, Delete, Param, Body, UploadedFiles, UseInterceptors, Query, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
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
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBody({ type: CreateProductDto })
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Handle colors as array or comma separated string
    let colors: string[] = [];
    if (typeof dto.colors === 'string') {
      colors = (dto.colors as string).split(',').map(c => c.trim());
    } else if (Array.isArray(dto.colors)) {
      colors = dto.colors;
    }
    dto.images = files;
    dto.colors = colors;
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
  @ApiQuery({ name: 'isArrival', required: false, type: String, description: 'Filter by new arrival (true/false)' })
  async findAll(@Query('isArrival') isArrival?: string) {
    if (typeof isArrival === 'undefined' || isArrival === null || isArrival === '') {
      return this.service.findAll();
    }
    if (isArrival === 'true') {
      return this.service.findByArrival(true);
    } else if (isArrival === 'false') {
      return this.service.findByArrival(false);
    } else {
      return this.service.findAll();
    }
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id') id: number,
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    dto.images = files;
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
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }
}
