import { Controller, Post, Get, Patch, Delete, Body, UploadedFiles, UseInterceptors, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { LotteryService } from './lotteries.service';
import { CreateLotteryDto, UpdateLotteryDto } from './dto/create-lottery.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('lotteries')
@Controller('lotteries')
export class LotteryController {
  constructor(private readonly service: LotteryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLotteryDto })
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() dto: CreateLotteryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    dto.images = files;
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'category', enum: ['active', 'lucky-dip', 'treasure'], required: false })
  findAll(@Query('category') category?: 'active' | 'lucky-dip' | 'treasure') {
    return this.service.findAll(category);
  }

  @Get('sold-out')
  getSoldOut() {
    return this.service.findSoldOut();
  }

  @Get('winners')
  getWinners() {
    return this.service.getWinners();
  }

  // Manual winner entry by admin (for now). In future, automate this process.
  @Post('winners')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lotteryId: { type: 'number', example: 1 },
        winnerName: { type: 'string', example: 'Ali Khan' },
        prize: { type: 'string', example: 'PKR 500,000 Cash' },
        drawDate: { type: 'string', format: 'date-time', example: '2025-07-17T12:00:00Z' }
      },
      required: ['lotteryId', 'winnerName', 'prize', 'drawDate']
    }
  })
  createWinner(@Body() body: { lotteryId: number; winnerName: string; prize: string; drawDate: Date }) {
    return this.service.createWinner(body);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateLotteryDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'inactive'], example: 'active' }
      },
      required: ['status']
    }
  })
  updateStatus(
    @Param('id') id: number,
    @Body() body: { status: 'active' | 'inactive' }
  ) {
    return this.service.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
