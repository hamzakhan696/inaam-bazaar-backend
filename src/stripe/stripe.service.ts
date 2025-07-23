import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  async createCheckoutSession({
    orderType,
    items,
    userId,
    totalAmount,
  }: {
    orderType: 'product' | 'lottery';
    items: any[];
    userId: number;
    totalAmount: number;
  }) {
    // Calculate sum of all item amounts * quantity (for products)
    let calculatedTotal = 0;
    if (orderType === 'product') {
      calculatedTotal = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    } else if (orderType === 'lottery') {
      calculatedTotal = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    }
    if (calculatedTotal !== totalAmount) {
      throw new BadRequestException('Total amount does not match sum of item amounts');
    }
    const line_items = items.map((item) => {
      if (orderType === 'product') {
        return {
          price_data: {
            currency: 'usd',
            product_data: { name: `Product ${item.productId}` },
            unit_amount: Math.round(item.amount * 100),
          },
          quantity: item.quantity,
        };
      } else {
        return {
          price_data: {
            currency: 'usd',
            product_data: { name: `Lottery ${item.lotteryId}` },
            unit_amount: Math.round(item.amount * 100),
          },
          quantity: item.quantity,
        };
      }
    });
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://yourfrontend.com/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourfrontend.com/payment-cancel',
      metadata: { orderType, userId: String(userId) },
    });
    return { url: session.url };
  }

  async getSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
} 