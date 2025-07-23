import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDealDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Deal images (upload files)',
  })
  images?: any;

  @ApiPropertyOptional({ description: 'Product ID' })
  productId?: number;

  @ApiPropertyOptional({ description: 'Lottery ID' })
  lotteryId?: number;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  comparePrice?: number;

  @ApiPropertyOptional()
  discount?: number;

  @ApiProperty()
  quantity: number;
} 