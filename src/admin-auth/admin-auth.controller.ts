import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ApiBody } from '@nestjs/swagger';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private configService: ConfigService) {}

  @Post('login')
  @UseGuards(AdminAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@example.com' },
        password: { type: 'string', example: 'StrongAdminPassword123' }
      },
      required: ['email', 'password']
    }
  })
  adminLogin(@Body() body: { email: string; password: string }) {
    // Generate JWT token
    const payload = { email: body.email, role: 'admin' };
    const secret = this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return { message: 'Admin login successful', token };
  }
} 