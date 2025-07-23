import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBody, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class LotteryItemDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  lotteryId: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  quantity: number;
}

export class ProductItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'L' })
  @IsString()
  size: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;
}

export class StripeCheckoutSessionDto {
  @ApiProperty({ enum: ['product', 'lottery'], example: 'product' })
  @IsEnum(['product', 'lottery'])
  orderType: 'product' | 'lottery';

  @ApiProperty({
    type: [ProductItemDto],
    oneOf: [
      { $ref: '#/components/schemas/ProductItemDto' },
      { $ref: '#/components/schemas/LotteryItemDto' }
    ]
  })
  @IsArray()
  items: any[];

  @ApiProperty({ example: 123 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  totalAmount: number;
}

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @ApiBody({ type: StripeCheckoutSessionDto })
  async createCheckoutSession(@Body() body: StripeCheckoutSessionDto) {
    // Validate items based on orderType
    if (body.orderType === 'lottery') {
      if (!body.items.every(item => 'lotteryId' in item && 'amount' in item && 'quantity' in item)) {
        throw new BadRequestException('Each item must have lotteryId, amount, and quantity for lottery orderType');
      }
    } else if (body.orderType === 'product') {
      if (!body.items.every(item => 'productId' in item && 'amount' in item && 'quantity' in item && 'size' in item && 'categoryId' in item)) {
        throw new BadRequestException('Each item must have productId, amount, quantity, size, and categoryId for product orderType');
      }
    }
    return this.stripeService.createCheckoutSession(body);
  }
} 