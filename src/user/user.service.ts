import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UpdateSignUpDto } from '../auth/dto/update-sign-up.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(signUpDto: SignUpDto) {
    const user = this.userRepo.create(signUpDto);
    return this.userRepo.save(user);
  }

  async update(email: string, updateDto: UpdateSignUpDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new Error('User not found');
    Object.assign(user, updateDto);
    return this.userRepo.save(user);
  }
} 