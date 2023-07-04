import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email_address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  constructor(email_address: string, password: string) {
    this.email_address = email_address;
    this.password = password;
  }

  async validatePassword(user: User): Promise<boolean> {
    console.log(user.password, this.password);
    if (user.password) {
      const hasPassword = bcrypt.compare(this.password, user.password);
      if (hasPassword) return hasPassword;
    }
    let isStudent = false;
    if (user.cnp) {
      const lastDigits = user.cnp.substring(7, 13);
      if (this.password === 'Student' + lastDigits) {
        isStudent = true;
      }
    }
    return isStudent;
  }
}
