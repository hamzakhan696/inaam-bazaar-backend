import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    // MOCK IMPLEMENTATION FOR JAZZCASH TESTING ONLY
    // Commented out all DB/customer logic for now
    // Generate unique order number
    const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
    // const order = this.orderRepository.create({
    //   ...createOrderDto,
    //   orderNumber,
    //   status: 'pending',
    //   paymentStatus: 'unpaid',
    // });
    // order.items = createOrderDto.items.map(item => this.orderItemRepository.create(item));

    // Payment gateway integration logic
    switch (createOrderDto.paymentMethod) {
      case 'jazzcash': {
        // JazzCash payment initiation logic
        const merchantId = 'MC187142';
        const password = 'z00h3uzyew';
        const integritySalt = '73vueg23ct';
        const returnUrl = 'http://192.168.18.198:3000/payment/callback';
        const amount = (createOrderDto.totalPayment * 100).toFixed(0); // Use totalPayment from DTO
        const txnRefNo = `T${Date.now()}`;
        // Add all required fields for JazzCash sandbox
        const postData = {
          pp_Version: '1.1',
          pp_TxnType: 'MWALLET',
          pp_Language: 'EN',
          pp_MerchantID: merchantId,
          pp_Password: password,
          pp_TxnRefNo: txnRefNo,
          pp_Amount: amount,
          pp_TxnCurrency: 'PKR',
          pp_TxnDateTime: this.getJazzCashDateTime(),
          pp_BillReference: orderNumber,
          pp_Description: 'Order Payment',
          pp_ReturnURL: returnUrl,
          // Required extra fields for sandbox
          pp_MobileNumber: '03001234567', // dummy
          pp_CNIC: '3520212345678', // dummy
          pp_MerchantEmail: 'test@example.com', // dummy
          ppmpf_1: 'custom1',
          ppmpf_2: 'custom2',
          ppmpf_3: 'custom3',
          ppmpf_4: 'custom4',
          ppmpf_5: 'custom5',
          pp_SecureHash: '', // To be filled after signature
        };
        // Generate signature
        const signature = this.generateJazzCashSignature(postData, integritySalt);
        postData.pp_SecureHash = signature;
        // Construct payment URL (for redirect)
        const paymentUrl = this.constructJazzCashPaymentUrl(postData);
        // MOCK: Do not save order to DB
        // await this.orderRepository.save(order);
        // Return payment URL for frontend to redirect
        return { paymentUrl };
      }
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
    // MOCK: Do not save order to DB
    // return this.orderRepository.save(order);
    return { message: 'Order created (mocked, no DB check)' };
  }

  // Helper to generate JazzCash signature
  private generateJazzCashSignature(data: any, integritySalt: string): string {
    // 1. Filter all keys starting with 'pp_' except 'pp_SecureHash'
    const keys = Object.keys(data)
      .filter(k => k.startsWith('pp_') && k !== 'pp_SecureHash')
      .sort(); // Alphabetical order
    // 2. Join values with '&'
    const joinedValues = keys.map(k => data[k]).join('&');
    // 3. Prepend integritySalt
    const stringToHash = `${integritySalt}&${joinedValues}`;
    // 4. HMAC-SHA256 with integritySalt as key
    const hmac = crypto.createHmac('sha256', integritySalt);
    hmac.update(stringToHash, 'utf8');
    return hmac.digest('hex');
  }

  // Helper to construct JazzCash payment URL
  private constructJazzCashPaymentUrl(data: any): string {
    const baseUrl = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';
    const params = Object.entries(data)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    return `${baseUrl}?${params}`;
  }

  // Helper to get JazzCash date time format
  private getJazzCashDateTime(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }

  findAll() {
    return this.orderRepository.find({ relations: ['items', 'customer'] });
  }

  async handleJazzCashCallback(body: any): Promise<{ success: boolean; orderId?: number }> {
    const integritySalt = '73vueg23ct';
    const receivedSignature = body.pp_SecureHash;
    // Remove signature from body for verification
    const dataForSign = { ...body };
    delete dataForSign.pp_SecureHash;
    // Use correct signature logic as per JazzCash docs
    const calculatedSignature = this.generateJazzCashSignature(dataForSign, integritySalt);
    if (receivedSignature !== calculatedSignature) {
      return { success: false };
    }
    // 2. Find order by bill reference (order number)
    const order = await this.orderRepository.findOne({ where: { orderNumber: body.pp_BillReference } });
    if (!order) return { success: false };
    // 3. Check payment status from JazzCash response
    if (body.pp_ResponseCode === '000') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await this.orderRepository.save(order);
      return { success: true, orderId: order.id };
    } else {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await this.orderRepository.save(order);
      return { success: false, orderId: order.id };
    }
  }
} 