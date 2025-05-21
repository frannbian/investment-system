import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { OrdersModule } from './orders/orders.module';
import { MarketDataModule } from './market-data/market-data.module';
import { User } from './users/user.entity';
import { Order } from './orders/order.entity';
import { MarketData } from './market-data/market-data.entity';
import { Instrument } from './instruments/instrument.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Order, MarketData, Instrument],
      synchronize: true,
    }),
    UsersModule,
    InstrumentsModule,
    OrdersModule,
    MarketDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
