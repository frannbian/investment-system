import { UsersService } from '../../users/users.service';
import { AbstractOrder } from './abstract-order';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from '../../instruments/instruments.service';
import { OrderStatus } from '../order.entity';
import { MarketDataService } from '../../market-data/market-data.service';

export class BuyLimitOrder extends AbstractOrder {
  constructor(
    protected readonly instrumentsService: InstrumentsService,
    protected readonly usersService: UsersService,
    protected readonly marketDataService: MarketDataService,
  ) {
    super(instrumentsService, usersService, marketDataService);
  }

  handleOrderPrice(createOrderDto: CreateOrderDto): number | undefined {
    return createOrderDto.price;
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
    return OrderStatus.NEW;
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
