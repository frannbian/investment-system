import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { OrderSide } from 'src/orders/order.entity';
import { PaginatedUsersDto } from './dtos/paginated-users.dto';
import { UserDto } from './dtos/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUsersDto> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: plainToInstance(UserDto, data, { excludeExtraneousValues: true }),
      total,
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return user;
  }

  async getPortfolio(userId: number) {
    const summary = await this.getUserSummary(userId);
    const availableCash = await this.getAvailableCash(userId);
    return {
      totalAccountValue: summary.totalAssetsValue + availableCash,
      availableCash,
      summary,
    };
  }

  async getUserSummary(userId: number) {
    const queryBuilder = this.userRepository.manager
      .createQueryBuilder()
      .select('i.ticker', 'ticker')
      .addSelect('i.name', 'name')
      .addSelect('i.type', 'type')
      .addSelect('md.close', 'currentPrice')
      .addSelect('o.instrument_id', 'instrumentId')
      .addSelect('SUM(o.size)', 'totalSize')
      .addSelect('md.previous_close', 'previousClose')
      .from('orders', 'o')
      .innerJoin('instruments', 'i', 'o.instrument_id = i.id')
      .innerJoin(
        (qb) =>
          qb
            .select('DISTINCT ON (instrument_id) instrument_id')
            .addSelect('close')
            .addSelect('previous_close')
            .addSelect('date')
            .from('marketdata', 'md')
            .orderBy('instrument_id')
            .addOrderBy('date', 'DESC'),
        'md',
        'md.instrument_id = i.id',
      )
      .where('o.user_id = :userId', { userId })
      .andWhere('o.status = :status', { status: 'FILLED' })
      .groupBy('o.instrument_id')
      .addGroupBy('i.name')
      .addGroupBy('i.ticker')
      .addGroupBy('i.type')
      .addGroupBy('md.close')
      .addGroupBy('md.previous_close');


    const orders = await queryBuilder.getRawMany();

    let totalAssetsValue = 0;

    const summary = orders.map((order) => {
      const totalValue =
        parseFloat(order.totalSize) * parseFloat(order.currentPrice);
      totalAssetsValue += totalValue;

      const totalPrice =
        parseFloat(order.totalSize) * parseFloat(order.previousClose);
      const performance = ((totalValue - totalPrice) / totalPrice) * 100;

      return {
        instrumentId: order.instrumentId,
        name: order.name,
        ticker: order.ticker,
        type: order.type,
        quantity: parseFloat(order.totalSize),
        totalValue,
        performance,
      };
    });

    return {
      totalAssetsValue,
      summary,
    };
  }

  async getAvailableCash(userId: number) {
    const cashIn = await this.sumOrderSizes(userId, OrderSide.CASH_IN);
    const cashOut = await this.sumOrderSizes(userId, OrderSide.CASH_OUT);
    return cashIn - cashOut;
  }

  async getAvailableInstrument(userId: number, instrumentId: number) {
    const instrumentsPurchased = await this.sumInstruments(
      userId,
      instrumentId,
      OrderSide.BUY,
    );
    const instrumentsSold = await this.sumInstruments(
      userId,
      instrumentId,
      OrderSide.SELL,
    );
    return instrumentsPurchased - instrumentsSold;
  }

  private async sumOrderSizes(
    userId: number,
    side: OrderSide,
  ): Promise<number> {
    const queryBuilder = this.userRepository.manager
      .createQueryBuilder()
      .select('SUM(o.size)', 'totalsize')
      .addSelect('SUM(o.price)', 'totalprice')
      .from('orders', 'o')
      .where('o.user_id = :userId', { userId })
      .andWhere('o.status = :status', { status: 'FILLED' })
      .andWhere('o.side = :side', { side: side.toString() });

    const result: { totalsize: number; totalprice: number } | undefined =
      await queryBuilder.getRawOne();

    if (side === OrderSide.CASH_IN || side === OrderSide.CASH_OUT) {
      return result?.totalsize || 0;
    } else {
      return result?.totalprice || 0;
    }
  }

  private async sumInstruments(
    userId: number,
    instrumentId: number,
    side: OrderSide,
  ): Promise<number> {
    const queryBuilder = this.userRepository.manager
      .createQueryBuilder()
      .select('SUM(o.size)', 'totalsize')
      .addSelect('SUM(o.price)', 'totalprice')
      .from('orders', 'o')
      .where('o.user_id = :userId', { userId })
      .andWhere('o.status = :status', { status: 'FILLED' })
      .andWhere('o.instrument_id = :instrumentId', { instrumentId })
      .andWhere('o.side = :side', { side: side.toString() });

    const result: { totalsize: number } | undefined =
      await queryBuilder.getRawOne();

    return result?.totalsize || 0;
  }
}
