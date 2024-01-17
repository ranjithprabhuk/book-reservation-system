import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { ValidationError } from 'src/shared/exceptions/validation.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignUpDto) {
    const saltOrRounds = parseInt(process.env.SALT_ROUND) || 10;
    const hashedPassword = await bcrypt.hash(signupDto.password, saltOrRounds);
    const result = await this._userService.create({
      ...signupDto,
      password: hashedPassword,
    });

    return this.generateToken(result);
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this._userService.findUserByUsername(username);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new NotAcceptableException(
        'Credentials you have provided are not valid. Please provide valid credentials',
      );
    }

    if (user && passwordValid) {
      return user;
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updatePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this._userService.findUserByUsername(username);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const passwordValid = await bcrypt.compare(oldPassword, user.password);

    if (!passwordValid) {
      throw new NotAcceptableException(
        'Old credentials you have provided are not valid. Please provide valid credentials',
      );
    }

    const saltOrRounds = parseInt(process.env.SALT_ROUND) || 10;
    const updatedHasedPassword = await bcrypt.hash(newPassword, saltOrRounds);

    this._userService.update(user.id, {
      ...user,
      password: updatedHasedPassword,
    });

    if (user && passwordValid) {
      return user;
    }

    return this.generateToken(user);
  }
}
