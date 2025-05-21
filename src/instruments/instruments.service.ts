import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { Repository } from 'typeorm';
import { Instrument } from './instrument.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
  ) {}

  async findAll() {
    return await this.instrumentRepository.find();
  }

  async findOne(id: number) {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
    });
    if (!instrument) {
      throw new NotFoundException('instrument not found');
    }
    return instrument;
  }

  async create(createInstrumentDto: CreateInstrumentDto) {
    const newUser = this.instrumentRepository.create(createInstrumentDto);
    return await this.instrumentRepository.save(newUser);
  }

  async update(id: number, attrs: Partial<Instrument>) {
    const instrument = await this.findOne(id);
    if (!instrument) {
      throw new NotFoundException('instrument not found');
    }
    Object.assign(instrument, attrs);
    return this.instrumentRepository.save(instrument);
  }

  async remove(id: number) {
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
