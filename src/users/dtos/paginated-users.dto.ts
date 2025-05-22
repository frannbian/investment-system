import { UserDto } from './user.dto';

export class PaginatedUsersDto {
  data: UserDto[];
  total: number;
}
