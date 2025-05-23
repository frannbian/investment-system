import { Instrument } from 'src/instruments/instrument.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Order, OrderStatus } from '../order.entity';
import { MarketDataService } from 'src/market-data/market-data.service';

export abstract class AbstractOrder {
  constructor(
    protected readonly instrumentsService: InstrumentsService,
    protected readonly usersService: UsersService,
    protected readonly marketDataService?: MarketDataService,
  ) {}

  abstract handleOrderPrice(
    createOrderDto: CreateOrderDto,
  ): Promise<number | undefined> | undefined;

  abstract handleOrderSize(
    createOrderDto: CreateOrderDto,
    order?: Order,
  ): Promise<number> | number;

  abstract handleOrderStatus(
    createOrderDto: CreateOrderDto,
    price?: number,
  ): Promise<OrderStatus> | OrderStatus;

  protected abstract isValidTransaction(
    createOrderDto: CreateOrderDto,
    price?: number,
  ): Promise<boolean> | boolean;

  async handleOrderInstrument(
    createOrderDto: CreateOrderDto,
  ): Promise<Instrument> {
    return await this.instrumentsService.findOne(createOrderDto.instrumentId);
  }

  async handleOrderUser(createOrderDto: CreateOrderDto): Promise<User> {
    return await this.usersService.findOne(createOrderDto.userId);
  }
}
