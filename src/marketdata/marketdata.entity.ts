import { Instrument } from 'src/instruments/instrument.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @Column('decimal', { precision: 10, scale: 2 })
  high: number;

  @Column('decimal', { precision: 10, scale: 2 })
  low: number;

  @Column('decimal', { precision: 10, scale: 2 })
  open: number;

  @Column('decimal', { precision: 10, scale: 2 })
  close: number;

  @Column('decimal', { precision: 10, scale: 2 })
  previousClose: number;

  @Column('timestamp')
  datetime: Date;
}
