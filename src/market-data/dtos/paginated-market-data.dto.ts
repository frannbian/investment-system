import { MarketDataDto } from './market-data.dto';

export class PaginatedMarketDataDto {
  data: MarketDataDto[];
  total: number;
}
