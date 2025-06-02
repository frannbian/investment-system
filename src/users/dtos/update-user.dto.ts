import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '../../shared/decorators/is-unique.decorator';
import { User } from '../user.entity';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @IsUnique(User, 'email', { message: 'Email already exists' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsUnique(User, 'accountNumber', { message: 'Account number already exists' })
  accountNumber?: string;
}
