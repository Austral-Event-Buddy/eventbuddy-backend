import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Constants } from '../../utils';

export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);

    if (!token) {
      // If there is no token, throw exception
      throw new UnauthorizedException();
    }

    // Verify token
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: Constants.JWT_SECRET,
      });
    } catch {
      // If token is invalid, throw exception
      throw new UnauthorizedException();
    }

    return true;
  }

  private getTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.get('authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
