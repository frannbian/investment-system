import {
  IsNumber,
  IsString,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { OrderSide, OrderType, SizeType } from '../order.entity';

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

  @IsNumber()
  @ValidateIf((o: CreateOrderDto) => o.type === OrderType.LIMIT)
  @IsNotEmpty({ message: 'price is required for LIMIT orders' })
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(OrderType, {
    message: 'side must be one of the following values: MARKET, LIMIT',
  })
  type: OrderType;

  @IsString()
  @ValidateIf(
    (o: CreateOrderDto) =>
      o.type === OrderType.MARKET && o.side === OrderSide.BUY,
  )
  @IsNotEmpty({ message: 'sizeType is required for LIMIT orders' })
  @IsEnum(SizeType, {
    message: 'size type must be one of the following values: QUANTITY, CASH',
  })
  sizeType: SizeType;
}
