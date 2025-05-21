import { IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  instrumentId: number;

  @IsNumber()
  userId: number;

  @IsString()
  @IsEnum(['buy', 'sell'])
  side: string;

  @IsNumber()
  size: number;

  @IsNumber()
  price: number;

  @IsString()
  @IsEnum(['market', 'limit'])
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
