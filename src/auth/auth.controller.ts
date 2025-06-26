import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
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
} 