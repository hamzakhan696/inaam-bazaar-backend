import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ type: 'string', format: 'binary', isArray: true, description: 'Product images (upload files)' })
  images?: any;

  @ApiPropertyOptional({ type: [String], description: 'Colors for each image, e.g. ["red", "blue"] or comma separated' })
  colors?: string[];

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

  @ApiPropertyOptional()
  isArrival?: boolean;
} 