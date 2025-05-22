import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedMarketDataDto } from './dtos/paginated-market-data.dto';
import { MarketDataDto } from './dtos/market-data.dto';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedMarketDataDto> {
    const { page, limit } = paginationQuery;
    return this.marketDataService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<MarketDataDto> {
    return this.marketDataService.findOne(id);
  }
}
