import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/products.entity';
import { Lottery } from '../lotteries/lotteries.entity';
import { ProductInventory } from '../products/product-inventory.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Lottery)
    private lotteryRepository: Repository<Lottery>,
    @InjectRepository(ProductInventory)
    private productInventoryRepository: Repository<ProductInventory>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      console.log('Creating order with DTO:', createOrderDto);
      
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Validate order type and items
      if (createOrderDto.orderType === 'product') {
        if (!createOrderDto.productItems || createOrderDto.productItems.length === 0) {
          throw new BadRequestException('Product items are required for product orders');
        }
      } else if (createOrderDto.orderType === 'lottery') {
        if (!createOrderDto.lotteryItems || createOrderDto.lotteryItems.length === 0) {
          throw new BadRequestException('Lottery items are required for lottery orders');
        }
      }

      console.log('Creating order with number:', orderNumber);

      // Create order
      const order = this.orderRepository.create({
        orderNumber,
        customerId: createOrderDto.userId, // Using userId as customerId for now
        status: 'pending',
        orderType: createOrderDto.orderType,
        paymentMethod: createOrderDto.paymentMethod,
        paymentStatus: createOrderDto.paymentStatus,
        totalPayment: createOrderDto.totalPayment,
      });

      console.log('Saving order to database...');
      const savedOrder = await this.orderRepository.save(order);
      console.log('Order saved with ID:', savedOrder.id);

      // Create order items based on order type
      if (createOrderDto.orderType === 'product') {
        console.log('Creating product order items...');
        await this.createProductOrderItems(savedOrder.id, createOrderDto.productItems!);
      } else if (createOrderDto.orderType === 'lottery') {
        console.log('Creating lottery order items...');
        await this.createLotteryOrderItems(savedOrder.id, createOrderDto.lotteryItems!);
      }

      // Update inventory if payment is successful
      if (createOrderDto.paymentStatus === 'paid') {
        console.log('Updating inventory...');
        if (createOrderDto.orderType === 'product') {
          await this.updateProductInventory(createOrderDto.productItems!);
        } else if (createOrderDto.orderType === 'lottery') {
          await this.updateLotteryInventory(createOrderDto.lotteryItems!);
        }
      }

      // Return order with items
      console.log('Fetching final order with items...');
      const finalOrder = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['items'],
      });

      if (!finalOrder) {
        throw new NotFoundException('Order not found after creation');
      }

      console.log('Order created successfully:', finalOrder.id);
      return finalOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  private async createProductOrderItems(orderId: number, productItems: any[]): Promise<void> {
    const orderItems = productItems.map(item => {
      return this.orderItemRepository.create({
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    });

    await this.orderItemRepository.save(orderItems);
  }

  private async createLotteryOrderItems(orderId: number, lotteryItems: any[]): Promise<void> {
    const orderItems = lotteryItems.map(item => {
      return this.orderItemRepository.create({
        orderId: orderId,
        lotteryId: item.lotteryId,
        quantity: item.quantity,
        price: item.price,
      });
    });

    await this.orderItemRepository.save(orderItems);
  }

  private async updateProductInventory(productItems: any[]): Promise<void> {
    for (const item of productItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId }
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      // Update product total quantity
      product.totalQuantity = Math.max(0, product.totalQuantity - item.quantity);
      await this.productRepository.save(product);

      // Update product inventory if exists
      const inventory = await this.productInventoryRepository.findOne({
        where: { product: { id: item.productId } }
      });

      if (inventory) {
        inventory.quantity = Math.max(0, inventory.quantity - item.quantity);
        await this.productInventoryRepository.save(inventory);
      }
    }
  }

  private async updateLotteryInventory(lotteryItems: any[]): Promise<void> {
    for (const item of lotteryItems) {
      const lottery = await this.lotteryRepository.findOne({
        where: { id: item.lotteryId }
      });

      if (!lottery) {
        throw new NotFoundException(`Lottery with ID ${item.lotteryId} not found`);
      }

      // Update lottery quantity
      lottery.quantity = Math.max(0, lottery.quantity - item.quantity);
      await this.lotteryRepository.save(lottery);
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ 
      relations: ['items', 'customer'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'customer']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId: userId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = await this.findById(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Order> {
    const order = await this.findById(id);
    order.paymentStatus = paymentStatus;
    return this.orderRepository.save(order);
  }
} 