import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInstrumentDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
