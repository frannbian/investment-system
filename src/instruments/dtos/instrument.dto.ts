import { Expose } from 'class-transformer';
import { InstrumentType } from '../instrument.entity';

export class InstrumentDto {
  @Expose()
  id: number;

  @Expose()
  ticker: string;

  @Expose()
  name: string;

  @Expose()
  type: InstrumentType;
}
