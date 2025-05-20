import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { OrdersModule } from './orders/orders.module';
import { MarketdataModule } from './marketdata/marketdata.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'cocos_root',
      password: 'root.!*',
      database: 'cocos_challange',
      entities: [],
      synchronize: true,
    }),
    UsersModule,
    InstrumentsModule,
    OrdersModule,
    MarketdataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
