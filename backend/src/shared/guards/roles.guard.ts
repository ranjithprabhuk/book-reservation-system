import {
  Injectable,
  CanActivate,
  ExecutionContext,
  applyDecorators,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

export const SetIsProtected = (isProtected: boolean) =>
  SetMetadata('isProtected', isProtected);
export const SetIsPrivate = (isPrivate: boolean) =>
  SetMetadata('isPrivate', isPrivate);
export const SetRole = (role: boolean) => SetMetadata('role', role);

export function Auth(isProtected = true, isPrivate = true, role = Role.USER) {
  return applyDecorators(
    SetMetadata('isProtected', isProtected),
    SetMetadata('isPrivate', isPrivate),
    SetMetadata('role', role),
    UseGuards(AuthGuard),
  );
}

@Injectable()
export class AuthGuard implements CanActivate {
  private userInfoFromToken = null;

  constructor(
    private _reflector: Reflector,
    private _userService: UserService,
    private _jwtService: JwtService,
  ) {}

  private getCookieValue = (cookie, name) =>
    cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this._reflector.get<string>(
      'isProtected',
      context.getHandler(),
    );
    const isPrivate = this._reflector.get<string>(
      'isPrivate',
      context.getHandler(),
    );
    const role = this._reflector.get<string>('role', context.getHandler());

    if (!isProtected && !isPrivate) {
      return true;
    }

    await this.validateToken(context);

    if (
      isProtected &&
      (!this.userInfoFromToken?.id ||
        (this.userInfoFromToken?.role !== role &&
        this.userInfoFromToken?.role !== Role.ADMIN))
    ) {
      return false;
    }

    if (isPrivate) {
      const request = context.switchToHttp().getRequest();
      if (
        request.params?.id &&
        request.params.id !== this.userInfoFromToken.id
      ) {
        return false;
      }
    }

    return true;
  }

  private async validateToken(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = this.getCookieValue(request?.headers.cookie, 'jwt');

    if (jwt) {
      const decodedTokenInfo = await this._jwtService.decode(jwt);
      this.userInfoFromToken = await this._userService.findOne(
        decodedTokenInfo.sub,
      );
    }
  }
}
