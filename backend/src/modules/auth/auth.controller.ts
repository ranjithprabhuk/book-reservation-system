import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
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
  async createUser(@Body() signupDto: SignUpDto) {
    return this._authService.signup(signupDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this._authService.login(loginDto.username, loginDto.password);
  }

  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req,
  ) {
    console.log('request >>>', req);
    return this._authService.updatePassword(
      req.user,
      updatePasswordDto.oldPassword,
      updatePasswordDto.password,
    );
  }
}
