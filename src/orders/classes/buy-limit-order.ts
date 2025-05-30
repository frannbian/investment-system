import { UsersService } from 'src/users/users.service';
import { AbstractOrder } from './abstract-order';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { Order, OrderStatus } from '../order.entity';
import { MarketDataService } from 'src/market-data/market-data.service';
import { Instrument } from 'src/instruments/instrument.entity';

export class BuyLimitOrder extends AbstractOrder {
  constructor(
    protected readonly instrumentsService: InstrumentsService,
    protected readonly usersService: UsersService,
    protected readonly marketDataService: MarketDataService,
  ) {
    super(instrumentsService, usersService, marketDataService);
  }

  handleOrderPrice(): Promise<number> | undefined {
    return;
  }

  async handleOrderSize(
    createOrderDto: CreateOrderDto,
    order: Order,
  ): Promise<number> {
    const instrument: Instrument = await this.instrumentsService.findOne(
      createOrderDto.instrumentId,
    );

    const marketData =
      await this.marketDataService.findOneByInstrument(instrument);

    const maxShares = Math.floor(createOrderDto.size / marketData.close);

    order.price = maxShares * marketData.close;
    if (maxShares <= 0) {
      throw new Error('Insufficient price for the order');
    }
    return maxShares;
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
