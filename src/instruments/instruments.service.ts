import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { Repository, ILike } from 'typeorm';
import { Instrument } from './instrument.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedInstrumentsDto } from './dtos/paginated-instruments.dto';
import { InstrumentDto } from './dtos/instrument.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    query: string = '',
  ): Promise<PaginatedInstrumentsDto> {
    const filter = query
      ? [{ ticker: ILike(`%${query}%`) }, { name: ILike(`%${query}%`) }]
      : [];
    const [data, total] = await this.instrumentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: filter,
    });
    return {
      data: plainToInstance(InstrumentDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
    };
  }

  async findOne(id: number): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
    });
    if (!instrument) {
      throw new NotFoundException('instrument not found');
    }
    return instrument;
  }

  async create(createInstrumentDto: CreateInstrumentDto): Promise<Instrument> {
    const newInstrument = this.instrumentRepository.create(createInstrumentDto);
    return await this.instrumentRepository.save(newInstrument);
  }

  async update(id: number, attrs: Partial<Instrument>): Promise<Instrument> {
    const instrument = await this.findOne(id);
    if (!instrument) {
      throw new NotFoundException('instrument not found');
    }
    Object.assign(instrument, attrs);
    return this.instrumentRepository.save(instrument);
  }

  async remove(id: number): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
    });
    if (!instrument) {
      throw new NotFoundException('instrument not found');
    }
    if (instrument) {
      await this.instrumentRepository.remove(instrument);
    }
    return instrument;
  }
}
