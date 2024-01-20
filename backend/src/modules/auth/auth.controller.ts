import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
@ApiTags('Auth Management')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  async createUser(
    @Body() signupDto: SignUpDto,
    @Res({ passthrough: true }) response,
  ) {
    const { access_token, password, ...rest } = await this._authService.signup(
      signupDto,
    );
    response.cookie('jwt', access_token, { httpOnly: true });
    response.cookie('isLoggedIn', true, { httpOnly: false });

    return { ...rest };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response,
  ) {
    const { user, access_token } = await this._authService.login(
      loginDto.username,
      loginDto.password,
    );
    const { password, ...rest } = user;

    response.cookie('jwt', access_token, { httpOnly: true });
    response.cookie('isLoggedIn', true, { httpOnly: false });
    return { ...rest };
  }

  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req,
  ) {
    return this._authService.updatePassword(
      req.user,
      updatePasswordDto.oldPassword,
      updatePasswordDto.password,
    );
  }
}
