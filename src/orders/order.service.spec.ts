import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import {
  Order,
  OrderSide,
  OrderStatus,
  OrderType,
  SizeType,
} from './order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MarketDataService } from 'src/market-data/market-data.service';
import { UsersService } from 'src/users/users.service';
import { Instrument, InstrumentType } from 'src/instruments/instrument.entity';
import { MarketData } from 'src/market-data/market-data.entity';
import { User } from 'src/users/user.entity';


describe('Testing order service flows', () => {
  let service: OrdersService;
  let usersService: UsersService;
  let instrumentsService: InstrumentsService;
  let marketDataService: MarketDataService;

  beforeEach(async () => {
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

    const mockUsersService = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
      }),
      getAvailableCash: jest.fn().mockResolvedValue(100000),
    };

    const mockInstrumentService = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
      }),
    };

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
        { provide: InstrumentsService, useValue: mockInstrumentService },
        { provide: UsersService, useValue: mockUsersService },
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

  function createOrderDtoHelper(
    side: OrderSide,
    type: OrderType,
    instrumentId: number,
    userId: number,
    size: number,
  ): CreateOrderDto {
    return { side, type, instrumentId, userId, size };
  }

  function expectOrder(
    order: Order,
    expected: {
      side: string;
      type: string;
      status: string;
      size: number;
      instrumentId: number;
      userId: number;
    },
  ) {
    expect(order).toBeDefined();
    expect(order.side).toBe(expected.side);
    expect(order.type).toBe(expected.type);
    expect(order.status).toBe(expected.status);
    expect(order.size).toBe(expected.size);
    expect(order.instrument.id).toBe(expected.instrumentId);
    expect(order.user.id).toBe(expected.userId);
  }

  it('should create a CASH_IN order', async () => {
    jest.spyOn(instrumentsService, 'findOne').mockResolvedValue({
      id: 2,
      name: 'Pesos.',
      ticker: 'ARS',
      type: InstrumentType.MONEDA,
    });

    const createOrderDto = createOrderDtoHelper(
      OrderSide.CASH_IN,
      OrderType.MARKET,
      2,
      1,
      100000,
    );
    await service.create(createOrderDto);
    const orders = await service.findAll();

    expect(orders.length).toBe(1);
    expectOrder(orders[0], {
      side: OrderSide.CASH_IN.toString(),
      type: OrderType.MARKET.toString(),
      status: OrderStatus.FILLED.toString(), // Assuming FILLED is the default status for CASH_IN
      size: 100000,
      instrumentId: 2,
      userId: 1,
    });
  });

  it('should throw an error when user try to buy a MARKET order with a lower price that the unit of the instrument', async () => {
    const createOrderDto = createOrderDtoHelper(
      OrderSide.BUY,
      OrderType.MARKET,
      1,
      1,
      50,
    );
    createOrderDto.sizeType = SizeType.CASH;

    await expect(service.create(createOrderDto)).rejects.toThrow(
      'Insufficient cash for event 1 unit of the instrument',
    );
  });

  it('should create an order with type LIMIT and status should be NEW', async () => {
    const createOrderDto = createOrderDtoHelper(
      OrderSide.BUY,
      OrderType.LIMIT,
      1,
      1,
      1000,
    );
    const result = await service.create(createOrderDto);
    const order = await service.findOne(result.id);

    expectOrder(order, {
      side: OrderSide.BUY.toString(),
      type: OrderType.LIMIT.toString(),
      status: OrderStatus.NEW.toString(),
      size: 1000,
      instrumentId: 1,
      userId: 1,
    });
  });

  it('should cancel an order with status NEW', async () => {
    const createOrderDto = createOrderDtoHelper(
      OrderSide.BUY,
      OrderType.LIMIT,
      1,
      1,
      1000,
    );
    const result = await service.create(createOrderDto);
    const order = await service.cancelOrder(result.id);

    expect(order).toBeDefined();
    expect(order.status).toBe(OrderStatus.CANCELLED.toString());
  });

  it('should not cancel an order with status different to NEW', async () => {
    const createOrderDto = createOrderDtoHelper(
      OrderSide.BUY,
      OrderType.MARKET,
      1,
      1,
      1000,
    );
    const result = await service.create(createOrderDto);

    await expect(service.cancelOrder(result.id)).rejects.toThrow(
      'Only orders with status "NEW" can be cancelled',
    );
  });

  it('should create an order with type MARKET and status should be FILLED', async () => {
    const createOrderDto = createOrderDtoHelper(
      OrderSide.BUY,
      OrderType.MARKET,
      1,
      1,
      10,
    );
    const result = await service.create(createOrderDto);
    const order = await service.findOne(result.id);

    expectOrder(order, {
      side: OrderSide.BUY.toString(),
      type: OrderType.MARKET.toString(),
      status: OrderStatus.FILLED.toString(),
      size: 10,
      instrumentId: 1,
      userId: 1,
    });
  });

  it('should create an order with type MARKET and status should be REJECTED if user has not founds to complete the order', async () => {
    const createOrderDto = createOrderDtoHelper(
      OrderSide.BUY,
      OrderType.MARKET,
      1,
      1,
      1000,
    );
    const result = await service.create(createOrderDto);
    const order = await service.findOne(result.id);

    expectOrder(order, {
      side: OrderSide.BUY.toString(),
      type: OrderType.MARKET.toString(),
      status: OrderStatus.REJECTED.toString(),
      size: 1000,
      instrumentId: 1,
      userId: 1,
    });
  });

  it('should create a CASH_OUT order', async () => {
    jest.spyOn(instrumentsService, 'findOne').mockResolvedValue({
      id: 2,
      name: 'Pesos.',
      ticker: 'ARS',
      type: InstrumentType.MONEDA,
    });

    const createOrderDto = createOrderDtoHelper(
      OrderSide.CASH_OUT,
      OrderType.MARKET,
      2,
      1,
      10000,
    );
    const result = await service.create(createOrderDto);
    const order = await service.findOne(result.id);

    expectOrder(order, {
      side: OrderSide.CASH_OUT.toString(),
      type: OrderType.MARKET.toString(),
      status: OrderStatus.FILLED.toString(),
      size: 10000,
      instrumentId: 2,
      userId: 1,
    });
  });

  it('should not create a CASH_OUT order if the user has not funds', async () => {
    jest.spyOn(instrumentsService, 'findOne').mockResolvedValue({
      id: 2,
      name: 'Pesos.',
      ticker: 'ARS',
      type: InstrumentType.MONEDA,
    });

    const createOrderDto = createOrderDtoHelper(
      OrderSide.CASH_OUT,
      OrderType.MARKET,
      2,
      1,
      1000000,
    );
    const result = await service.create(createOrderDto);
    const order = await service.findOne(result.id);

    expectOrder(order, {
      side: OrderSide.CASH_OUT.toString(),
      type: OrderType.MARKET.toString(),
      status: OrderStatus.REJECTED.toString(),
      size: 1000000,
      instrumentId: 2,
      userId: 1,
    });
  });
});
