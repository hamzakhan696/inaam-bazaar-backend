import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('cod')
  async createCashOnDeliveryOrder(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.paymentMethod = 'cod'; // Force payment method to COD
    return this.ordersService.create(createOrderDto);
  }
} 