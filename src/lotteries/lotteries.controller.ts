import { Controller, Post, Get, Patch, Delete, Body, UploadedFiles, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { LotteryService } from './lotteries.service';
import { CreateLotteryDto } from './dto/create-lottery.dto';
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
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: any) {
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
