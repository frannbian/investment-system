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
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.register([
      {
        name: 'KAKFA_SERVICE', // Register the Kafka client
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Replace with your Kafka broker(s)
          },
        },
      },
    ]),
    UsersModule,
    InstrumentsModule,
    OrdersModule,
    MarketDataModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 5000,
      max: 10,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
