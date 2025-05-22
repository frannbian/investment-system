import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from 'src/shared/decorators/is-unique.decorator';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsUnique(User, 'email', { message: 'Email already exists' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsUnique(User, 'accountNumber', { message: 'Account number already exists' })
  accountNumber: string;
}
