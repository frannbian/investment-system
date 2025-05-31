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
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
