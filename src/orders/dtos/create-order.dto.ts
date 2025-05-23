import { IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderSide, OrderType } from '../order.entity';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  instrumentId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(OrderSide, {
    message:
      'side must be one of the following values: BUY, SELL, CASH_IN, CASH_OUT',
  })
  side: OrderSide;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(OrderType, {
    message: 'side must be one of the following values: MARKET, LIMIT',
  })
  type: OrderType;
}
