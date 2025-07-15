import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const user = await this.authService.signUp(signUpDto);
      // Auto-login: generate JWT token
      const jwt = require('jsonwebtoken');
      const secret = this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret';
      const token = jwt.sign({ id: user.id, email: user.email, contactNumber: user.contactNumber }, secret, { expiresIn: '7d' });
      return { success: true, token, user };
    } catch (error) {
      // Duplicate email/phone error (TypeORM)
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        return { success: false, message: 'Email or phone number already exists' };
      }
      // Validation or other errors
      return { success: false, message: error.message || 'Signup failed' };
    }
  }

  @Put('signup')
  @ApiOperation({ summary: 'Update user sign up details' })
  @ApiQuery({ name: 'email', required: true, description: 'Email of the user to update' })
  @ApiBody({ type: UpdateSignUpDto })
  async updateSignUp(
    @Query('email') email: string,
    @Body() updateSignUpDto: UpdateSignUpDto,
  ) {
    return this.authService.updateSignUp(email, updateSignUpDto);
  }

  @Post('whatsapp-login')
  @ApiOperation({ summary: 'Login via WhatsApp token' })
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string' } }, required: ['token'] } })
  async whatsappLogin(@Body('token') token: string) {
    const jwt = require('jsonwebtoken');
    const secret = this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret';
    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch (e) {
      return { success: false, message: 'Invalid or expired token' };
    }
    // Find user by id and contactNumber
    const user = await this.authService.getUserService().findByPhone(payload.contactNumber);
    if (!user || user.id !== payload.id) {
      return { success: false, message: 'User not found' };
    }
    // Generate app JWT for user
    const appToken = jwt.sign({ id: user.id, email: user.email, contactNumber: user.contactNumber }, secret, { expiresIn: '7d' });
    return { success: true, token: appToken, user };
  }
} 