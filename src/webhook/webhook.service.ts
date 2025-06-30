import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async handleIncomingMessage(body: any) {
    console.log('Received WhatsApp Webhook:', JSON.stringify(body, null, 2));
    this.logger.log('Received WhatsApp Webhook: ' + JSON.stringify(body, null, 2));
    // Auto-reply example: send a message back if a message is received
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    if (messages && messages.length > 0) {
      const from = messages[0].from; // WhatsApp user phone number
      await this.sendWhatsAppMessage(from, 'Thank you for contacting us! (Auto-reply)');
    }
  }

  async sendWhatsAppMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v19.0/684177008114996/messages`;
    const data = {
      messaging_product: 'whatsapp',
      to,
      text: { body: message },
    };
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer EAAKeQD0DoYcBO6CipcoRkUSkdZArnhLN2OYVSjrL6hWwoosOcpXHZCYO0cCj9SqxUnoHn95vDImcVuBsCuCZAQVwUl3enCnZAmkRHcQeibroxbfazXCxxpcbA0R5t40kiTdUZCeeYNOhJfKgLHCaaVEQ7X3wJ8x96pO3XbA1hZAu9n7KV459nwj2xpIA8vb9jZBXpbBqOyCXiaxXbMURnNXf1qQSC1GJQBknpAS5OZABwAifb7tGTyXJPy1sEywZD`,
          'Content-Type': 'application/json',
        },
      });
      this.logger.log('WhatsApp message sent: ' + JSON.stringify(response.data));
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message', error?.response?.data || error.message);
    }
  }
} 