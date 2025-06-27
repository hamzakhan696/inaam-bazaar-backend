import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@Controller('webhook/whatsapp')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  // GET for verification
  @Get()
  verify(
    @Query('hub.mode') mode: string,

    
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    }
    return { status: 403 };
  }

  // POST for receiving messages
  @Post()
  @ApiBody({ schema: { type: 'object', example: {
    "entry": [
      {
        "changes": [
          {
            "value": {
              "messages": [
                {
                  "from": "923001234567",
                  "id": "ABGGFlA5FpafAgo6EhNMzJGb8A",
                  "timestamp": "1620220222",
                  "text": {
                    "body": "Hello"
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  } } })
  async receive(@Body() body: any) {
    await this.webhookService.handleIncomingMessage(body);
    return { status: 'ok' };
  }
} 