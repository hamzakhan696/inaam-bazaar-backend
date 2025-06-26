import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Product images (upload files)'
  })
  images?: any;

  @ApiProperty({ required: false })
  color?: string;

  @ApiProperty({ type: [String], required: false })
  sizes?: string[];

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  comparePrice?: number;

  @ApiProperty({ required: false })
  discount?: number;

  @ApiProperty()
  inventory: number;

  @ApiProperty()
  categoryId: number;
} 