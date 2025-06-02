import { Expose } from 'class-transformer';
import { Instrument } from 'src/instruments/instrument.entity';

export class MarketDataDto {
  @Expose()
  id: number;

  @Expose()
  high: number;

  @Expose()
  low: number;

  @Expose()
  open: number;

  @Expose()
  close: number;

  @Expose()
  previousClose: number;

  @Expose()
  date: Date;

  @Expose()
  instrument: Instrument;
}
