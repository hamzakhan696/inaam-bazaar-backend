import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
// import { AuthService } from '../auth/auth.service';
import { sendWhatsAppSignupTemplate } from '../utils/whatsapp-message.util';
import { UserModule } from '../user/user.module';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly userService: UserService,
    // private readonly authService: AuthService,
  ) {}

  async handleIncomingMessage(body: any) {
    console.log('Received WhatsApp Webhook:', JSON.stringify(body, null, 2));
    this.logger.log('Received WhatsApp Webhook: ' + JSON.stringify(body, null, 2));
    const from = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (!from) return;

    const user = await this.userService.findByPhone?.(from);

    if (user) {
      // User exists, send dummy login deep link (plain text for now)
      // TODO: Implement login template if needed
      // For now, just log or send a plain text message if required
      this.logger.log(`User exists: ${from}. Implement login template if needed.`);
    } else {
      // User not found, send signup template
      await sendWhatsAppSignupTemplate(from);
    }
  }
}
