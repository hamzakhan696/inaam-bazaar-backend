import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiBody({ type: CreateDiscountDto })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  findAll() {
    return this.discountsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: any) {
    return this.discountsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.discountsService.remove(id);
  }
} 