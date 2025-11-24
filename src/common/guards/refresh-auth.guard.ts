/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyRefreshToken } from '../utils/jwt';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = header.split(' ')[1];

    try {
      const decoded = verifyRefreshToken(token);
      req.user = decoded; // you can mark isRefresh = true if needed
      return true;
    } catch (err) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }
}
