import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  // PKR to GBP conversion rate (you can make this dynamic)
  private readonly PKR_TO_GBP_RATE = 0.0028; // 1 PKR = 0.0028 GBP (approximate)

  // Mobile Payment Intent (for mobile applications only)
  async createPaymentIntent({
    orderType,
    items,
    userId,
    totalAmount, // This will be in PKR from frontend
    customerEmail,
  }: {
    orderType: 'product' | 'lottery';
    items: any[];
    userId: number;
    totalAmount: number; // Amount in PKR
    customerEmail?: string;
  }) {
    // Calculate sum of all item amounts * quantity (in PKR)
    let calculatedTotalPKR = 0;
    if (orderType === 'product') {
      calculatedTotalPKR = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    } else if (orderType === 'lottery') {
      calculatedTotalPKR = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    }
    
    if (calculatedTotalPKR !== totalAmount) {
      throw new BadRequestException('Total amount does not match sum of item amounts');
    }

    // Convert PKR to GBP for Stripe
    const amountInGBP = totalAmount * this.PKR_TO_GBP_RATE;
    const amountInPence = Math.round(amountInGBP * 100); // Convert GBP to pence

    // Create or get customer
    let customer;
    if (customerEmail) {
      const existingCustomers = await this.stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await this.stripe.customers.create({
          email: customerEmail,
          metadata: { userId: String(userId) },
        });
      }
    }

    // Create payment intent with GBP currency
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInPence, // Amount in pence
      currency: 'gbp', // British Pound
      customer: customer?.id,
      metadata: {
        orderType,
        userId: String(userId),
        items: JSON.stringify(items),
        originalAmountPKR: String(totalAmount), // Store original PKR amount
        convertedAmountGBP: String(amountInGBP), // Store converted GBP amount
        conversionRate: String(this.PKR_TO_GBP_RATE), // Store conversion rate
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `${orderType === 'product' ? 'Product' : 'Lottery'} Purchase - User ${userId} - PKR ${totalAmount} (£${amountInGBP.toFixed(2)})`,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount, // Amount in pence
      amountPKR: totalAmount, // Original amount in PKR
      amountGBP: amountInGBP, // Converted amount in GBP
      currency: paymentIntent.currency, // Should be 'gbp'
      conversionRate: this.PKR_TO_GBP_RATE,
    };
  }

  // Get Payment Intent Status (for mobile apps)
  async getPaymentIntent(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Get original PKR amount from metadata
    const originalAmountPKR = parseFloat(paymentIntent.metadata?.originalAmountPKR || '0');
    const amountGBP = paymentIntent.amount / 100; // Convert pence to GBP
    
    return {
      ...paymentIntent,
      amountPKR: originalAmountPKR, // Original amount in PKR
      amountGBP: amountGBP, // Amount in GBP
      originalAmountPKR: originalAmountPKR,
      convertedAmountGBP: paymentIntent.metadata?.convertedAmountGBP,
      conversionRate: paymentIntent.metadata?.conversionRate,
    };
  }

  // Create Customer (for mobile apps)
  async createCustomer(email: string, userId: number) {
    return this.stripe.customers.create({
      email,
      metadata: { userId: String(userId) },
    });
  }

  // Setup Intent (for saving payment methods)
  async createSetupIntent(customerId: string) {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
  }

  // Helper method to convert PKR to GBP
  convertPKRToGBP(pkrAmount: number): number {
    return pkrAmount * this.PKR_TO_GBP_RATE;
  }

  // Helper method to convert GBP to PKR
  convertGBPToPKR(gbpAmount: number): number {
    return gbpAmount / this.PKR_TO_GBP_RATE;
  }

  // Helper method to convert GBP to pence
  convertGBPToPence(gbpAmount: number): number {
    return Math.round(gbpAmount * 100);
  }

  // Helper method to convert pence to GBP
  convertPenceToGBP(penceAmount: number): number {
    return penceAmount / 100;
  }
} 