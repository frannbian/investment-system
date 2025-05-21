import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketData } from './market-data.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MarketDataService {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketDataRepository: Repository<MarketData>,
  ) {}

  async findAll() {
    return await this.marketDataRepository.find();
  }

  async findOne(id: number) {
    const marketData = await this.marketDataRepository.findOne({
      where: { id },
    });
    if (!marketData) {
      throw new NotFoundException('market data not found');
    }
    return marketData;
  }
}
