import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    // Generate unique order number
    const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
    // TODO: Implement DB logic for order creation
    switch (createOrderDto.paymentMethod) {
      case 'cod':
        // Cash on Delivery, no online payment needed
        break;
      default:
        throw new Error('Invalid payment method');
    }
    return { message: 'Order created (mocked, no DB check)' };
  }

  findAll() {
    return this.orderRepository.find({ relations: ['items', 'customer'] });
  }
} 