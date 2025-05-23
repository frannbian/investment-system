import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instrument } from '../instruments/instrument.entity'; // Adjust the path as needed
import { User } from '../users/user.entity'; // Adjust the path as needed

export enum OrderStatus {
  NEW = 'NEW',
  FILLED = 'FILLED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrument_id' })
  instrument: Instrument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  size: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: OrderType,
    nullable: true,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderSide,
    nullable: true,
  })
  side: OrderSide;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: true,
  })
  status: OrderStatus;

  @Column()
  datetime: Date;
}
