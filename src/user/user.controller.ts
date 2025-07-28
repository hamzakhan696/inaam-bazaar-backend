import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSignUpDto } from '../auth/dto/update-sign-up.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID (partial update)' })
  @ApiBody({ type: UpdateSignUpDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async patchUser(@Param('id') id: number, @Body() updateDto: UpdateSignUpDto) {
    return this.userService.updateById(id, updateDto);
  }
} 