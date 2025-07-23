import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { StripeService } from '../stripe/stripe.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('cod')
  async createCashOnDeliveryOrder(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.paymentMethod = 'cod'; // Force payment method to COD
    return this.ordersService.create(createOrderDto);
  }

  @Post('stripe-success')
  async handleStripeSuccess(@Body() body: any) {
    const { sessionId, orderData } = body;
    const session = await this.stripeService.getSession(sessionId);
    if (session.payment_status === 'paid') {
      return this.ordersService.create(orderData);
    } else {
      throw new Error('Payment not verified');
    }
  }
} 