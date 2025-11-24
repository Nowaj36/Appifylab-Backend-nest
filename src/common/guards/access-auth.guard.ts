/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyAccessToken } from '../utils/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();

    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = header.split(' ')[1];

    try {
      const decoded = verifyAccessToken(token) as {
        id: number;
        iat: number;
        exp: number;
      };

      // Just attach decoded data (NOT Auth entity)
      req.user = {
        id: decoded.id,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalid or expired');
    }
  }
}
