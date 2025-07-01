import { ApiProperty } from '@nestjs/swagger';

class InventoryDto {
  @ApiProperty()
  size: string;
  @ApiProperty()
  quantity: number;
}

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

  @ApiProperty({ type: [InventoryDto] })
  inventory: InventoryDto[];

  @ApiProperty()
  categoryId: number;
} 