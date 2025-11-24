/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// common/filters/error.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception.message || 'Internal Server Error';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    response.status(status).json({ success: false, message });
  }
}
