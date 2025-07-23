import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateProductItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'Quantity to purchase' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Price per unit in PKR' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Product size' })
  @IsString()
  size: string;

  @ApiProperty({ description: 'Category ID' })
  @IsNumber()
  categoryId: number;

  @ApiPropertyOptional({ description: 'Product color' })
  @IsOptional()
  @IsString()
  color?: string;
}

class CreateLotteryItemDto {
  @ApiProperty({ description: 'Lottery ID' })
  @IsNumber()
  lotteryId: number;

  @ApiProperty({ description: 'Number of tickets to purchase' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Price per ticket in PKR' })
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ 
    type: [CreateProductItemDto], 
    description: 'Array of product items (required for product orders)' 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductItemDto)
  productItems?: CreateProductItemDto[];

  @ApiProperty({ 
    type: [CreateLotteryItemDto], 
    description: 'Array of lottery items (required for lottery orders)' 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLotteryItemDto)
  lotteryItems?: CreateLotteryItemDto[];

  @ApiProperty({ enum: ['product', 'lottery'], description: 'Type of order' })
  @IsEnum(['product', 'lottery'])
  orderType: 'product' | 'lottery';

  @ApiProperty({ enum: ['stripe', 'jazzcash', 'easypaisa', 'cod'], description: 'Payment method' })
  @IsEnum(['stripe', 'jazzcash', 'easypaisa', 'cod'])
  paymentMethod: string;

  @ApiProperty({ enum: ['paid', 'unpaid', 'pending'], description: 'Payment status' })
  @IsEnum(['paid', 'unpaid', 'pending'])
  paymentStatus: string;

  @ApiProperty({ description: 'Total amount in PKR' })
  @IsNumber()
  totalPayment: number;

  @ApiPropertyOptional({ description: 'Stripe payment intent ID (for Stripe payments)' })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @ApiPropertyOptional({ description: 'Customer email' })
  @IsOptional()
  @IsString()
  customerEmail?: string;
} 