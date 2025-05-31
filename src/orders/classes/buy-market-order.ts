import { UsersService } from 'src/users/users.service';
import { AbstractOrder } from './abstract-order';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { Order, OrderStatus, OrderType } from '../order.entity';
import { MarketDataService } from 'src/market-data/market-data.service';
import { Instrument } from 'src/instruments/instrument.entity';

export class BuyMarketOrder extends AbstractOrder {
  constructor(
    protected readonly instrumentsService: InstrumentsService,
    protected readonly usersService: UsersService,
    protected readonly marketDataService: MarketDataService,
  ) {
    super(instrumentsService, usersService, marketDataService);
  }

  async handleOrderPrice(
    createOrderDto: CreateOrderDto,
  ): Promise<number | undefined> {
    const instrument = await this.instrumentsService.findOne(
      createOrderDto.instrumentId,
    );
    const marketData =
      await this.marketDataService.findOneByInstrument(instrument);

    if (createOrderDto.type === OrderType.MARKET) {
      return marketData.close * createOrderDto.size;
    } else if (createOrderDto.type === OrderType.LIMIT) {
      return createOrderDto.size;
    }

    throw new Error('Invalid order type for price determination');
  }

  async handleOrderSize(
    createOrderDto: CreateOrderDto,
    order: Order,
  ): Promise<number> {
    if (createOrderDto.price) {
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
    return createOrderDto.size;
  }

  async handleOrderStatus(
    createOrderDto: CreateOrderDto,
    price: number,
  ): Promise<OrderStatus> {
    if (!(await this.isValidTransaction(createOrderDto, price))) {
      return OrderStatus.REJECTED;
    }
    return OrderStatus.FILLED;
  }

  protected async isValidTransaction(
    createOrderDto: CreateOrderDto,
    price: number,
  ): Promise<boolean> {
    const orderAmount: number = price;

    const availableCash = await this.usersService.getAvailableCash(
      createOrderDto.userId,
    );

    if (availableCash < orderAmount) {
      return false;
    }

    return true;
  }
}
