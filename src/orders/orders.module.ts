import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { Instrument } from '../instruments/instrument.entity';
import { User } from '../users/user.entity';
import { InstrumentsModule } from '../instruments/instruments.module';
import { UsersModule } from '../users/users.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Instrument, User]),
    InstrumentsModule,
    UsersModule,
    MarketDataModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
