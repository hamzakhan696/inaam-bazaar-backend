import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  district?: string;

  @ApiPropertyOptional({ default: false })
  isEmailSubscribed?: boolean;

  @ApiPropertyOptional({ default: false })
  isSmsSubscribed?: boolean;
} 