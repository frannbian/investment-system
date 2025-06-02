import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketData } from './market-data.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from '../instruments/instrument.entity';
import { PaginatedMarketDataDto } from './dtos/paginated-market-data.dto';
import { plainToInstance } from 'class-transformer';
import { MarketDataDto } from './dtos/market-data.dto';

@Injectable()
export class MarketDataService {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketDataRepository: Repository<MarketData>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedMarketDataDto> {
    const [data, total] = await this.marketDataRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['instrument'],
    });
    return {
      data: plainToInstance(MarketDataDto, data),
      total,
    };
  }
  async findOne(id: number): Promise<MarketData> {
    const marketData = await this.marketDataRepository.findOne({
      where: { id },
      relations: ['instrument'],
    });
    if (!marketData) {
      throw new NotFoundException('market data not found');
    }
    return marketData;
  }

  async findOneByInstrument(instrument: Instrument) {
    const marketData = await this.marketDataRepository.findOne({
      where: { instrument },
    });
    if (!marketData) {
      throw new NotFoundException('market data not found');
    }
    return marketData;
  }
}
