import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Number })
  contactNumber: number;

  @ApiPropertyOptional({ enum: ['male', 'female'] })
  gender?: 'male' | 'female';

  @ApiPropertyOptional()
  nationality?: string;

  @ApiPropertyOptional({ type: Number })
  dateOfBirth?: number;

  @ApiPropertyOptional()
  profilePicture?: string;
} 