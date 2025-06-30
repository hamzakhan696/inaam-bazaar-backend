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

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Generate unique order number
    const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;
    const order = this.orderRepository.create({
      ...createOrderDto,
      orderNumber,
      status: 'pending',
      paymentStatus: 'unpaid',
    });
    order.items = createOrderDto.items.map(item => this.orderItemRepository.create(item));
    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find({ relations: ['items', 'customer'] });
  }
} 