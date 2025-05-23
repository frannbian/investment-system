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
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
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
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis server host
      port: 6379, // Redis server port
      ttl: 5000, // Cache expiration time
      max: 10, // Maximum number of items in cache
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
