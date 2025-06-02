import { UsersService } from '../../users/users.service';
import { AbstractOrder } from './abstract-order';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from '../../instruments/instruments.service';
import { OrderStatus } from '../order.entity';

export class CashInOrder extends AbstractOrder {
  constructor(
    protected readonly instrumentsService: InstrumentsService,
    protected readonly usersService: UsersService,
  ) {
    super(instrumentsService, usersService);
  }

  handleOrderPrice(): undefined {
    return;
  }

  handleOrderSize(createOrderDto: CreateOrderDto): number {
    return createOrderDto.size;
  }

  handleOrderStatus(): OrderStatus {
    return OrderStatus.FILLED;
  }

  protected isValidTransaction(): boolean {
    return true;
  }
}
