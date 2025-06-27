import { Controller, Get, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDealDto })
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createDealDto: CreateDealDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.dealsService.create(createDealDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  findAll() {
    return this.dealsService.findAll();
  }
} 