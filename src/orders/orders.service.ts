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
        const merchantId = 'MC191942';
        const password = '1zy8gvh2f0';
        const integritySalt = '92y5xv3tyt';
        const returnUrl = 'http://192.168.18.198:3001/jazzcash';
        const amount = (createOrderDto.totalPayment * 100).toFixed(0); // Use totalPayment from DTO
        const txnRefNo = `T${Date.now()}`;
        // Add all required fields for JazzCash sandbox
        const postData = {
          pp_Version: '2.0',
          pp_TxnType: 'MWALLET',
          pp_Language: 'EN',
          pp_MerchantID: merchantId,
          pp_TxnRefNo: txnRefNo,
          pp_Amount: amount,
          pp_TxnCurrency: 'PKR',
          pp_TxnDateTime: this.getJazzCashDateTime(),
          pp_BillReference: orderNumber,
          pp_Description: 'Order Payment',
          pp_ReturnURL: returnUrl,
          pp_MobileNumber: '03123456789', // dummy
          pp_CNIC: '3520212345678', // dummy
          pp_MerchantEmail: 'test@example.com', // dummy
          ppmpf_1: 'custom1',
          ppmpf_2: 'custom2',
          ppmpf_3: 'custom3',
          ppmpf_4: 'custom4',
          ppmpf_5: 'custom5',
          pp_SecureHash: '', // To be filled after signature
        };
        console.log('JazzCash postData:', postData); // Debug log
        // Generate signature
        const signature = this.generateJazzCashSignature(postData, integritySalt);
        postData.pp_SecureHash = signature;
        console.log('JazzCash postData with signature:', postData); // Debug log
        // Ensure customer exists before saving order
        let customerId = createOrderDto.customerId;
        if (customerId) {
          const customerRepo = this.orderRepository.manager.getRepository('Customer');
          const existingCustomer = await customerRepo.findOne({ where: { id: customerId } });
          if (!existingCustomer) {
            // Create a test customer if not exists
            await customerRepo.save({ id: customerId, name: 'Test Customer', contactNumber: '03123456789' });
          }
        }
        // Save order to DB
        const order = this.orderRepository.create({
          ...createOrderDto,
          orderNumber,
          status: 'pending',
          paymentStatus: 'unpaid',
        });
        order.items = createOrderDto.items.map(item => this.orderItemRepository.create(item));
        await this.orderRepository.save(order);
        // Return postData (with signature) to frontend
        return { postData };
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

  async initiateJazzCashPayment(createOrderDto: CreateOrderDto): Promise<{ paymentUrl: string }> {
    // JazzCash payment initiation logic
    const merchantId = 'MC191942';
    const password = '1zy8gvh2f0';
    const integritySalt = '92y5xv3tyt';
    // IMPORTANT: Set returnUrl to your frontend success page for best UX
    const returnUrl = 'http://localhost:3000/payment-success';
    const amount = (createOrderDto.totalPayment * 100).toFixed(0); // Use totalPayment from DTO
    const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
    const txnRefNo = `T${Date.now()}`;
    const postData = {
      pp_Version: '2.0',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      // pp_Password: password, // Removed as per troubleshooting
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amount,
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: this.getJazzCashDateTime(),
      pp_BillReference: orderNumber,
      pp_Description: 'Order Payment',
      pp_ReturnURL: returnUrl,
      pp_MobileNumber: '03123456789',
      pp_CNIC: '3520212345678',
      pp_MerchantEmail: 'test@example.com',
      ppmpf_1: 'custom1',
      ppmpf_2: 'custom2',
      ppmpf_3: 'custom3',
      ppmpf_4: 'custom4',
      ppmpf_5: 'custom5',
      pp_SecureHash: '',
    };
    // Generate signature
    const signature = this.generateJazzCashSignature(postData, integritySalt);
    postData.pp_SecureHash = signature;
    // Construct payment URL
    const baseUrl = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';
    const params = Object.entries(postData)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    const paymentUrl = `${baseUrl}?${params}`;
    console.log('JazzCash paymentUrl:', paymentUrl);
    console.log('JazzCash postData:', postData);
    return { paymentUrl };
  }

  // Helper to generate JazzCash signature
  private generateJazzCashSignature(data: any, integritySalt: string): string {
    // JazzCash recommended field order
    const fieldOrder = [
      'pp_Amount',
      'pp_BillReference',
      'pp_CNIC',
      'pp_Description',
      'pp_Language',
      'pp_MerchantID',
      'pp_MerchantEmail',
      'pp_MobileNumber',
      'pp_ReturnURL',
      'pp_TxnCurrency',
      'pp_TxnDateTime',
      'pp_TxnRefNo',
      'pp_TxnType',
      'pp_Version',
      'ppmpf_1',
      'ppmpf_2',
      'ppmpf_3',
      'ppmpf_4',
      'ppmpf_5'
    ];
    // Only include fields present in data
    const joinedValues = fieldOrder.map(k => data[k] || '').join('&');
    const stringToHash = `${integritySalt}&${joinedValues}`;
    console.log('JazzCash stringToHash:', stringToHash); // Debug log
    const hmac = crypto.createHmac('sha256', integritySalt);
    hmac.update(stringToHash, 'utf8');
    const signature = hmac.digest('hex');
    console.log('JazzCash signature:', signature); // Debug log
    return signature;
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
    const integritySalt = '92y5xv3tyt'; // Updated to match sandbox credentials
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