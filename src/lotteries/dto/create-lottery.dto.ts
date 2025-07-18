import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

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

  @ApiProperty()
  price: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Lottery images (upload files)'
  })
  images?: any;

  @ApiProperty({ enum: ['active', 'lucky-dip', 'treasure'], required: true })
  category: 'active' | 'lucky-dip' | 'treasure';

  @ApiProperty({ enum: ['active', 'inactive'], default: 'active', required: false })
  status?: 'active' | 'inactive';
}

export class UpdateLotteryDto extends PartialType(CreateLotteryDto) {} 