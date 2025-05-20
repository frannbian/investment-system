import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instrument } from '../instruments/instrument.entity'; // Adjust the path as needed
import { User } from '../users/user.entity'; // Adjust the path as needed

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  side: string;

  @Column('decimal', { precision: 10, scale: 2 })
  size: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  datetime: Date;
}
