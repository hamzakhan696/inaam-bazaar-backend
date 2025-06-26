import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Number })
  contactNumber: number;

  @ApiProperty()
  nationality: string;

  @ApiProperty({ type: Number })
  dateOfBirth: number;

  @ApiPropertyOptional()
  profilePicture?: string;
} 