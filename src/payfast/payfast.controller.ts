import { Controller, Get, Query, Post, Body, Req, Res } from '@nestjs/common';
import { PayfastService } from './payfast.service';
import { Request, Response } from 'express';

@Controller('payfast')
export class PayfastController {
  constructor(private readonly payfastService: PayfastService) {}

  @Get('payment-url')
  getPaymentUrl(@Query('orderId') orderId: string, @Query('amount') amount: string, @Query('email') email: string) {
    // Validate params as needed
    return {
      url: this.payfastService.generatePaymentUrl(orderId, amount, email),
    };
  }

  @Post('webhook')
  handleWebhook(@Req() req: Request, @Res() res: Response) {
    // TODO: Validate PayFast signature and process payment status
    // You can access req.body for posted data
    // Update order/payment status in your DB here
    res.status(200).send('OK');
  }
} 