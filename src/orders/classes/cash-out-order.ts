import { UsersService } from 'src/users/users.service';
import { AbstractOrder } from './abstract-order';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { OrderStatus } from '../order.entity';

export class CashOutOrder extends AbstractOrder {
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

  async handleOrderStatus(
    createOrderDto: CreateOrderDto,
  ): Promise<OrderStatus> {
    if (!(await this.isValidTransaction(createOrderDto))) {
      return OrderStatus.REJECTED;
    }
    return OrderStatus.FILLED;
  }

  protected async isValidTransaction(
    createOrderDto: CreateOrderDto,
  ): Promise<boolean> {
    const orderAmount: number = createOrderDto.size;
    const availableCash = await this.usersService.getAvailableCash(
      createOrderDto.userId,
    );

    if (availableCash < orderAmount) {
      return false;
    }

    return true;
  }
}
