import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    type: 'array',
    items: { type: 'number' },
    description: 'Array of product IDs',
  })
  productIds: number[];
} 