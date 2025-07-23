import { Controller, Post, Body, Get, Param, Put, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { StripeService } from '../stripe/stripe.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('cod')
  @ApiOperation({ summary: 'Create Cash on Delivery order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createCashOnDeliveryOrder(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.paymentMethod = 'cod'; // Force payment method to COD
    createOrderDto.paymentStatus = 'pending'; // COD orders are pending until delivered
    return this.ordersService.create(createOrderDto);
  }

  @Post('stripe-success')
  @ApiOperation({ summary: 'Handle successful Stripe payment and create order' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentIntentId: { type: 'string', example: 'pi_xxx' },
        orderData: { type: 'object', example: {} }
      },
      required: ['paymentIntentId', 'orderData']
    }
  })
  @ApiResponse({ status: 201, description: 'Order created successfully after payment verification' })
  async handleStripeSuccess(@Body() body: any) {
    try {
      const { paymentIntentId, orderData } = body;
      
      console.log('Processing Stripe success:', { paymentIntentId, orderData });
      
      const paymentIntent = await this.stripeService.getPaymentIntent(paymentIntentId);
      
      console.log('Payment intent status:', paymentIntent.status);
      
      if (paymentIntent.status === 'succeeded') {
        // Set payment status to paid for successful Stripe payments
        orderData.paymentStatus = 'paid';
        
        console.log('Creating order with data:', orderData);
        
        const order = await this.ordersService.create(orderData);
        
        console.log('Order created successfully:', order.id);
        
        return order;
      } else {
        throw new Error(`Payment not verified. Status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Error in handleStripeSuccess:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('test')
  @ApiOperation({ summary: 'Test database connection' })
  @ApiResponse({ status: 200, description: 'Database connection test' })
  async testConnection() {
    try {
      // Test basic database operations
      const orderCount = await this.ordersService.findAll();
      return {
        message: 'Database connection successful',
        orderCount: orderCount.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database test error:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findById(@Param('id') id: number) {
    return this.ordersService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({ status: 200, description: 'List of user orders' })
  async findByUserId(@Param('userId') userId: number) {
    return this.ordersService.findByUserId(userId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { 
          type: 'string', 
          enum: ['pending', 'fulfilled', 'unfulfilled'],
          example: 'fulfilled'
        }
      },
      required: ['status']
    }
  })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() body: { status: string }
  ) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  @Put(':id/payment-status')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentStatus: { 
          type: 'string', 
          enum: ['paid', 'unpaid', 'pending'],
          example: 'paid'
        }
      },
      required: ['paymentStatus']
    }
  })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  async updatePaymentStatus(
    @Param('id') id: number,
    @Body() body: { paymentStatus: string }
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus);
  }
} 