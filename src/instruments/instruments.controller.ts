import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { InstrumentsService } from './instruments.service';
import { UpdateInstrumentDto } from './dtos/update-instrument.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedInstrumentsDto } from './dtos/paginated-instruments.dto';
import { InstrumentDto } from './dtos/instrument.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentService: InstrumentsService) {}

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('query') query: string,
  ): Promise<PaginatedInstrumentsDto> {
    const { page, limit } = paginationQuery;
    return this.instrumentService.findAll(page, limit, query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<InstrumentDto> {
    return await this.instrumentService.findOne(id);
  }

  @Post()
  create(@Body() createOrderDto: CreateInstrumentDto): Promise<InstrumentDto> {
    return this.instrumentService.create(createOrderDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstrumentDto: UpdateInstrumentDto,
  ): Promise<InstrumentDto> {
    return this.instrumentService.update(id, updateInstrumentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<InstrumentDto> {
    return this.instrumentService.remove(id);
  }
}
