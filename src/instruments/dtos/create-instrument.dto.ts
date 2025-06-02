import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Instrument, InstrumentType } from '../instrument.entity';
import { IsUnique } from '../../shared/decorators/is-unique.decorator';

export class CreateInstrumentDto {
  @IsString()
  @IsNotEmpty()
  @IsUnique(Instrument, 'ticker', { message: 'Ticker already exists' })
  ticker: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(InstrumentType, {
    message: 'side must be one of the following values: ACCIONES, MONEDA',
  })
  type: InstrumentType;
}
