import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateOrderItemDto {
  @ApiPropertyOptional()
  productId?: number;

  @ApiPropertyOptional()
  lotteryId?: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty()
  customerId: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  items: CreateOrderItemDto[];

  @ApiProperty({ enum: ['jazzcash', 'easypaisa', 'cod'] })
  paymentMethod: string;

  @ApiProperty()
  totalPayment: number;
} 