import { Expose, Transform } from 'class-transformer';

export class OrderDto {
  @Expose()
  id: number;

  @Transform(({ obj }) => obj.instrument.id)
  @Expose()
  instrumentId: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  side: string;

  @Expose()
  size: number;

  @Expose()
  price: number;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose()
  datetime: Date;
}
