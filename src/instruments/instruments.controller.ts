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
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { InstrumentsService } from './instruments.service';
import { UpdateInstrumentDto } from './dtos/update-instrument.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedInstrumentsDto } from './dtos/paginated-instruments.dto';
import { InstrumentDto } from './dtos/instrument.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(
    private readonly instrumentService: InstrumentsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('query') query: string,
  ): Promise<PaginatedInstrumentsDto> {
    const { page, limit } = paginationQuery;
    const cacheKey = `instruments:findAll:${page}:${limit}:${query}`;

    const cachedResult = await this.cacheManager.get<PaginatedInstrumentsDto>(cacheKey);

    if (cachedResult) {
      console.log('Cache hit for findAll');
      return cachedResult;
    }

    const result = await this.instrumentService.findAll(page, limit, query);
    await this.cacheManager.set(cacheKey, result, 10000);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<InstrumentDto> {
    const cacheKey = `instruments:findOne:${id}`;
    const cachedResult = await this.cacheManager.get<InstrumentDto>(cacheKey);

    if (cachedResult) {
      console.log('Cache hit for findOne');
      return cachedResult;
    }

    const result = await this.instrumentService.findOne(id);
    await this.cacheManager.set(cacheKey, result, 10000);
    return result;
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
