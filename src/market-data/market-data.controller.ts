import { Controller, Get, Param } from '@nestjs/common';
import { MarketDataService } from './market-data.service';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get()
  findAll() {
    return this.marketDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.marketDataService.findOne(id);
  }
}
