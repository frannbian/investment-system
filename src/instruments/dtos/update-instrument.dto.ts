import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { InstrumentType } from '../instrument.entity';

export class UpdateInstrumentDto {
  @IsString()
  @IsNotEmpty()
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
