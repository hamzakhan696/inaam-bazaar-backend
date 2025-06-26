import { ApiProperty } from '@nestjs/swagger';

export class CreateLotteryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  quantity: number;
} 