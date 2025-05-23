import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderSide, OrderType } from './order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MarketDataService } from 'src/market-data/market-data.service';
import { UsersService } from 'src/users/users.service';
import { Instrument } from 'src/instruments/instrument.entity';
import { MarketData } from 'src/market-data/market-data.entity';
import { User } from 'src/users/user.entity';

describe('OrdersService with SQLite', () => {
  let service: OrdersService;
  let usersService: UsersService;
  let instrumentsService: InstrumentsService;
  let marketDataService: MarketDataService;

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue({ id: 1 }),
    getAvailableCash: jest.fn().mockResolvedValue(1000),
    getAvailableInstrument: jest.fn().mockResolvedValue(10),
  };

  const mockInstrumentsService = {
    findOne: jest.fn().mockResolvedValue({ id: 1 }),
  };

  const mockMarketDataService = {
    findOneByInstrument: jest.fn().mockResolvedValue({ close: 100 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Order, Instrument, MarketData, User],
          synchronize: true, // not for prod!
        }),
        TypeOrmModule.forFeature([Order, Instrument, MarketData, User]),
      ],
      providers: [
        OrdersService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: InstrumentsService, useValue: mockInstrumentsService },
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
      name: 'Test Instrument',
      ticker: 'TEST',
    });
    const userRepository = module.get('UserRepository');
    await userRepository.save({
      id: 1,
      email: 'testing@test.com',
      accountNumber: '5',
    });
  });

  it('should create and return an order', async () => {
    const createOrderDto: CreateOrderDto = {
      side: OrderSide.CASH_IN,
      type: OrderType.MARKET,
      instrumentId: 1,
      userId: 1,
      size: 100000,
    };

    const result = await service.create(createOrderDto);
    const orders = await service.findAll();

    expect(orders.length).toBe(1);
    expect(orders[0].side).toBe(OrderSide.CASH_IN.toString());
    expect(orders[0].type).toBe(OrderType.MARKET.toString());
    expect(orders[0].size).toBe(100000);
    expect(orders[0].instrument.id).toBe(1);
    expect(orders[0].user.id).toBe(1);
  });
});