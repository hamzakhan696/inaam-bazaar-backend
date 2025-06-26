import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CustomColorsService } from './custom-colors.service';
import { CreateCustomColorDto } from './dto/create-custom-color.dto';

@ApiTags('custom-colors')
@Controller('custom-colors')
export class CustomColorsController {
  constructor(private readonly service: CustomColorsService) {}

  @Post()
  @ApiBody({ type: CreateCustomColorDto })
  create(@Body() dto: CreateCustomColorDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
} 