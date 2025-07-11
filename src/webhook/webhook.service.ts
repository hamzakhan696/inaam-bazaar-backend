import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { sendWhatsAppSignupTemplate, sendWhatsAppLoginTemplate } from '../utils/whatsapp-message.util';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async handleIncomingMessage(body: any) {
    console.log('Received WhatsApp Webhook:', JSON.stringify(body, null, 2));
    this.logger.log('Received WhatsApp Webhook: ' + JSON.stringify(body, null, 2));
    const from = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (!from) return;

    const user = await this.userService.findByPhone?.(from);

    if (user) {
      // User exists, generate login token and send login link
      const payload = { id: user.id, contactNumber: user.contactNumber };
      const secret = this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret';
      const token = jwt.sign(payload, secret, { expiresIn: '10m' });
      await sendWhatsAppLoginTemplate(from, token);
      this.logger.log(`User exists: ${from}. Sent WhatsApp login link.`);
    } else {
      // User not found, send signup template
      await sendWhatsAppSignupTemplate(from);
    }
  }
}
