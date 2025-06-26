import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomColorDto {
  @ApiProperty()
  name: string;
} 