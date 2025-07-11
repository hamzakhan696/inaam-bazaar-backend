import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(signUpDto: SignUpDto) {
    // Create a new user
    return this.userService.create(signUpDto);
  }

  async updateSignUp(email: string, updateSignUpDto: UpdateSignUpDto) {
    // Update user by email
    return this.userService.update(email, updateSignUpDto);
  }

  public getUserService() {
    return this.userService;
  }
} 