import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { Instrument } from 'src/instruments/instrument.entity';
import { User } from 'src/users/user.entity';
import { InstrumentsModule } from 'src/instruments/instruments.module';
import { UsersModule } from 'src/users/users.module';
import { MarketDataModule } from 'src/market-data/market-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Instrument, User]),
    InstrumentsModule,
    UsersModule,
    MarketDataModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
