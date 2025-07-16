import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';

@Controller('jazzcash')
export class JazzCashController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async handleJazzCash(@Body() body: any, @Res() res: Response) {
    const result = await this.ordersService.handleJazzCashCallback(body);
    if (result.success) {
      return res.redirect(`/payment-success?orderId=${result.orderId}`);
    } else {
      return res.redirect(`/payment-failure?orderId=${result.orderId}`);
    }
  }
} 