import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Response, Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('cod')
  async createCashOnDeliveryOrder(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.paymentMethod = 'cod'; // Force payment method to COD
    return this.ordersService.create(createOrderDto);
  }

  @Post('jazzcash')
  async createJazzCashOrder(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.paymentMethod = 'jazzcash';
    return this.ordersService.create(createOrderDto);
  }

  @Post('/payment/callback')
  async jazzCashCallback(@Body() body: any, @Res() res: Response) {
    // Forward to service for processing
    const result = await this.ordersService.handleJazzCashCallback(body);
    // Optionally, redirect to a frontend page with status
    if (result.success) {
      return res.redirect(`/payment-success?orderId=${result.orderId}`);
    } else {
      return res.redirect(`/payment-failure?orderId=${result.orderId}`);
    }
  }
} 