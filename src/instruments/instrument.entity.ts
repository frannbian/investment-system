import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum InstrumentType {
  ACCIONES = 'ACCIONES',
  MONEDA = 'MONEDA',
}
export const InstrumentCurrencyId = 66;
@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  ticker: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10, nullable: true })
  type: InstrumentType;
}
