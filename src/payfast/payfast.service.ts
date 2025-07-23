import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PayfastService {
  private merchantId = process.env.PAYFAST_MERCHANT_ID || '10000100';
  private merchantPassword = process.env.PAYFAST_MERCHANT_PASSWORD || 'abc123';
  private integritySalt = process.env.PAYFAST_INTEGRITY_SALT || 'abc123';
  private payfastUrl = 'https://sandbox.payfast.pk/checkout';

  generateSignature(data: Record<string, string>): string {
    const sorted = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');
    return crypto.createHmac('sha256', this.integritySalt).update(sorted).digest('hex');
  }

  generatePaymentUrl(orderId: string, amount: string, email: string): string {
    const data = {
      merchant_id: this.merchantId,
      merchant_password: this.merchantPassword,
      amount,
      order_id: orderId,
      email,
      return_url: process.env.PAYFAST_RETURN_URL || 'https://yourdomain.com/payment-success',
      cancel_url: process.env.PAYFAST_CANCEL_URL || 'https://yourdomain.com/payment-cancel',
      notify_url: process.env.PAYFAST_NOTIFY_URL || 'https://yourbackend.com/api/payfast/webhook',
    };
    const signature = this.generateSignature(data);
    const params = { ...data, signature };
    const query = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    return `${this.payfastUrl}?${query}`;
  }
} 