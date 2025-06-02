import { InstrumentDto } from './instrument.dto';

export class PaginatedInstrumentsDto {
  data: InstrumentDto[];
  total: number;
}
