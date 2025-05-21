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
  @JoinColumn({ name: 'instrument_id' })
  instrument: Instrument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  size: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 10 })
  type: string;

  @Column({ length: 10 })
  side: string;

  @Column({ length: 10 })
  status: string;

  @Column()
  datetime: Date;
}
