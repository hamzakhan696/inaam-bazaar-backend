import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiPropertyOptional()
  discountCode?: string;

  @ApiProperty()
  discountValue: number;

  @ApiPropertyOptional({ description: 'Category ID to which discount applies' })
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Product ID to which discount applies' })
  productId?: number;

  @ApiProperty()
  maximumDiscountUses: number;

  @ApiProperty({ type: [String], description: 'Combination types e.g. product, order, shipping' })
  combination: string[];

  @ApiProperty({ type: Date })
  startDate: Date;

  @ApiProperty({ type: Date })
  endDate: Date;
} 