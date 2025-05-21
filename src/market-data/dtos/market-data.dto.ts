import { Expose, Transform } from 'class-transformer';

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
  datetime: Date;

  @Transform(({ obj }) => obj.instrument.id)
  @Expose()
  instrumentId: number;
}
