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
    const order = await this.marketDataRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('market data not found');
    }
    return order;
  }
}
