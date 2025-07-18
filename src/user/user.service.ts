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
    // Check for existing user by email or contactNumber
    const existing = await this.userRepo.findOne({
      where: [
        { email: signUpDto.email },
        { contactNumber: signUpDto.contactNumber }
      ]
    });
    if (existing) {
      throw new Error('User with this email or contact number already exists');
    }
    const user = this.userRepo.create(signUpDto);
    return this.userRepo.save(user);
  }

  async update(email: string, updateDto: UpdateSignUpDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new Error('User not found');
    Object.assign(user, updateDto);
    return this.userRepo.save(user);
  }

  async findByPhone(phone: string) {
    return this.userRepo.findOne({ where: { contactNumber: Number(phone) } });
  }

  async findAll() {
    return this.userRepo.find();
  }
} 