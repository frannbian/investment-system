import { UsersService } from 'src/users/users.service';
import { AbstractOrder } from './abstract-order';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { Order as OrderEntity, OrderStatus } from '../order.entity';

export class CashInOrder extends AbstractOrder {
  constructor(
    protected readonly instrumentsService: InstrumentsService,
    protected readonly usersService: UsersService,
  ) {
    super(instrumentsService, usersService);
  }

  handleOrderPrice(createOrderDto: CreateOrderDto): Promise<number> | undefined {
    return;
  }

  handleOrderSize(
    createOrderDto: CreateOrderDto,
    order?: OrderEntity,
  ): Promise<number> | number {
    return createOrderDto.size;
  }

  handleOrderStatus(
    createOrderDto: CreateOrderDto,
    price?: number,
  ): OrderStatus {
    return OrderStatus.FILLED;
  }

  protected isValidTransaction(): boolean {
    return true;
  }
}
