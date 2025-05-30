import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderSide, OrderStatus, OrderType } from './order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MarketDataService } from 'src/market-data/market-data.service';
import { UsersService } from 'src/users/users.service';
import { Instrument } from 'src/instruments/instrument.entity';
import { MarketData } from 'src/market-data/market-data.entity';
import { User } from 'src/users/user.entity';

async function addFundsToUser(service: OrdersService) {
  const createOrderDto: CreateOrderDto = {
    side: OrderSide.CASH_IN,
    type: OrderType.MARKET,
    instrumentId: 2,
    userId: 1,
    size: 100000,
  };

  await service.create(createOrderDto);
}

describe('Testing order service flows', () => {
  let service: OrdersService;
  let usersService: UsersService;
  let instrumentsService: InstrumentsService;
  let marketDataService: MarketDataService;

  const mockMarketDataService = {
    findOneByInstrument: jest.fn().mockResolvedValue({
      high: 342.5,
      low: 328.5,
      open: 337.5,
      close: 341.5,
      previousClose: 335.0,
      instrument_id: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Order, Instrument, MarketData, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Order, Instrument, MarketData, User]),
      ],
      providers: [
        OrdersService,
        UsersService,
        InstrumentsService,
        { provide: MarketDataService, useValue: mockMarketDataService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    usersService = module.get<UsersService>(UsersService);
    instrumentsService = module.get<InstrumentsService>(InstrumentsService);
    marketDataService = module.get<MarketDataService>(MarketDataService);

    const instrumentRepository = module.get('InstrumentRepository');
    await instrumentRepository.save({
      id: 1,
      name: 'Edenor S.A.',
      ticker: 'EDN',
      type: 'ACCIONES',
    });
    await instrumentRepository.save({
      id: 2,
      name: 'Pesos.',
      ticker: 'ARS',
      type: 'MONEDA',
    });

    const userRepository = module.get('UserRepository');
    await userRepository.save({
      id: 1,
      email: 'user@test.com',
      accountNumber: '10001',
    });
  });

  it('should create a CASH_IN order', async () => {
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.CASH_IN,
      type: OrderType.MARKET,
      instrumentId: 2,
      userId: 1,
      size: 100000,
    };

    await service.create(createOrderDto);
    const orders = await service.findAll();

    expect(orders.length).toBe(1);
    expect(orders[0].side).toBe(OrderSide.CASH_IN.toString());
    expect(orders[0].type).toBe(OrderType.MARKET.toString());
    expect(orders[0].size).toBe(100000);
    expect(orders[0].instrument.id).toBe(2);
    expect(orders[0].user.id).toBe(1);
  });

  it('should throw an error when user try to buy a LIMIT order with a lower price that the unit of the instrument', async () => {
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      instrumentId: 1,
      userId: 1,
      size: 50,
    };

    await expect(service.create(createOrderDto)).rejects.toThrow(
      'Insufficient price for the order',
    );
  });

  it('should create an order with type LIMIT and status should be NEW', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      instrumentId: 1,
      userId: 1,
      size: 1000,
    };

    const result = await service.create(createOrderDto);
    const order: Order = await service.findOne(result.id);

    expect(order).toBeDefined();
    expect(order.side).toBe(OrderSide.BUY.toString());
    expect(order.type).toBe(OrderType.LIMIT.toString());
    expect(order.status).toBe(OrderStatus.NEW.toString());
    expect(order.size).toBe(2);
    expect(order.instrument.id).toBe(1);
    expect(order.user.id).toBe(1);
  });
  it('should cancel an order with status NEW', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      instrumentId: 1,
      userId: 1,
      size: 1000,
    };

    const result: Order = await service.create(createOrderDto);

    const order: Order = await service.cancelOrder(result.id);

    expect(order).toBeDefined();
    expect(order.status).toBe(OrderStatus.CANCELLED.toString());
  });

  it('should not cancel an order with status different to NEW', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      instrumentId: 1,
      userId: 1,
      size: 1000,
    };

    const result: Order = await service.create(createOrderDto);

    await expect(service.cancelOrder(result.id)).rejects.toThrow(
      'Only orders with status "NEW" can be cancelled',
    );
  });

  it('should create an order with type MARKET and status should be FILLED', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      instrumentId: 1,
      userId: 1,
      size: 10,
    };

    const result = await service.create(createOrderDto);
    const order: Order = await service.findOne(result.id);

    expect(order).toBeDefined();
    expect(order.side).toBe(OrderSide.BUY.toString());
    expect(order.type).toBe(OrderType.MARKET.toString());
    expect(order.status).toBe(OrderStatus.FILLED.toString());
    expect(order.size).toBe(10);
    expect(order.instrument.id).toBe(1);
    expect(order.user.id).toBe(1);
  });

  it('should create an order with type MARKET and status should be REJECTED if user has not founds to complete the order', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      instrumentId: 1,
      userId: 1,
      size: 1000,
    };

    const result = await service.create(createOrderDto);
    const order: Order = await service.findOne(result.id);

    expect(order).toBeDefined();
    expect(order.side).toBe(OrderSide.BUY.toString());
    expect(order.type).toBe(OrderType.MARKET.toString());
    expect(order.status).toBe(OrderStatus.REJECTED.toString());
    expect(order.size).toBe(1000);
    expect(order.instrument.id).toBe(1);
    expect(order.user.id).toBe(1);
  });

  it('should create a CASH_OUT order', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.CASH_OUT,
      type: OrderType.MARKET,
      instrumentId: 2,
      userId: 1,
      size: 10000,
    };

    const result = await service.create(createOrderDto);
    const order: Order = await service.findOne(result.id);

    expect(order).toBeDefined();
    expect(order.side).toBe(OrderSide.CASH_OUT.toString());
    expect(order.type).toBe(OrderType.MARKET.toString());
    expect(order.status).toBe(OrderStatus.FILLED.toString());
    expect(order.size).toBe(10000);
    expect(order.instrument.id).toBe(2);
    expect(order.user.id).toBe(1);
  });

  it('should not create a CASH_OUT order if the user has not funds', async () => {
    await addFundsToUser(service);
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.CASH_OUT,
      type: OrderType.MARKET,
      instrumentId: 2,
      userId: 1,
      size: 1000000,
    };

    const result = await service.create(createOrderDto);
    const order: Order = await service.findOne(result.id);

    expect(order).toBeDefined();
    expect(order.side).toBe(OrderSide.CASH_OUT.toString());
    expect(order.type).toBe(OrderType.MARKET.toString());
    expect(order.status).toBe(OrderStatus.REJECTED.toString());
    expect(order.size).toBe(10000);
    expect(order.instrument.id).toBe(2);
    expect(order.user.id).toBe(1);
  });
});
