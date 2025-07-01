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

    // Payment gateway integration logic
    switch (createOrderDto.paymentMethod) {
      case 'jazzcash':
        // TODO: Integrate JazzCash payment gateway here
        // Example: await this.processJazzCashPayment(order);
        break;
      case 'easypaisa':
        // TODO: Integrate EasyPaisa payment gateway here
        // Example: await this.processEasyPaisaPayment(order);
        break;
      case 'cod':
        // Cash on Delivery, no online payment needed
        break;
      default:
        throw new Error('Invalid payment method');
    }

    // Order type logic (for future use, e.g., notifications, analytics)
    // order.orderType will be 'product' or 'lottery'

    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find({ relations: ['items', 'customer'] });
  }
} 