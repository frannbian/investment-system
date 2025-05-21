import { Expose } from 'class-transformer';

export class InstrumentDto {
  @Expose()
  id: number;

  @Expose()
  ticker: string;

  @Expose()
  name: string;

  @Expose()
  type: string;
}
