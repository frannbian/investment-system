import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
