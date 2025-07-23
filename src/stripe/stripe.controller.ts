import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBody, ApiTags, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsEmail } from 'class-validator';

export class LotteryItemDto {
  @ApiProperty({ example: 5, description: 'Lottery ID' })
  @IsNumber()
  lotteryId: number;

  @ApiProperty({ example: 200, description: 'Price per ticket in PKR' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 1, description: 'Number of tickets to purchase' })
  @IsNumber()
  quantity: number;
}

export class ProductItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 100, description: 'Price per unit in PKR' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 2, description: 'Quantity to purchase' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'L', description: 'Product size' })
  @IsString()
  size: string;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 'Red', description: 'Product color', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}

export class StripePaymentIntentDto {
  @ApiProperty({ enum: ['product', 'lottery'], example: 'product', description: 'Type of order' })
  @IsEnum(['product', 'lottery'])
  orderType: 'product' | 'lottery';

  @ApiProperty({
    type: [ProductItemDto],
    description: 'Array of items to purchase'
  })
  @IsArray()
  items: any[];

  @ApiProperty({ example: 123, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 500, description: 'Total amount in PKR' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 'user@example.com', description: 'Customer email for Stripe customer creation', required: false })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}

@ApiTags('Stripe Payment')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Mobile Payment Intent (for mobile applications only)
  @Post('create-payment-intent')
  @ApiBody({ type: StripePaymentIntentDto })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createPaymentIntent(@Body() body: StripePaymentIntentDto) {
    // Validate items based on orderType
    if (body.orderType === 'lottery') {
      if (!body.items.every(item => 'lotteryId' in item && 'amount' in item && 'quantity' in item)) {
        throw new BadRequestException('Each lottery item must have lotteryId, amount, and quantity');
      }
    } else if (body.orderType === 'product') {
      if (!body.items.every(item => 'productId' in item && 'amount' in item && 'quantity' in item && 'size' in item && 'categoryId' in item)) {
        throw new BadRequestException('Each product item must have productId, amount, quantity, size, and categoryId');
      }
    }

    return this.stripeService.createPaymentIntent(body);
  }

  // Get Payment Intent Status (for mobile apps)
  @Get('payment-intent/:paymentIntentId')
  @ApiResponse({ status: 200, description: 'Payment intent retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment intent not found' })
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    return this.stripeService.getPaymentIntent(paymentIntentId);
  }

  // Create Customer (for mobile apps)
  @Post('create-customer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        userId: { type: 'number', example: 123 }
      },
      required: ['email', 'userId']
    }
  })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async createCustomer(@Body() body: { email: string; userId: number }) {
    return this.stripeService.createCustomer(body.email, body.userId);
  }

  // Create Setup Intent (for saving payment methods)
  @Post('create-setup-intent')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', example: 'cus_1234567890' }
      },
      required: ['customerId']
    }
  })
  @ApiResponse({ status: 201, description: 'Setup intent created successfully' })
  async createSetupIntent(@Body() body: { customerId: string }) {
    return this.stripeService.createSetupIntent(body.customerId);
  }
} 