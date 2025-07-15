import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Category images (upload files)',
  })
  images?: any;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [Number], required: false })
  productIds?: number[];
} 