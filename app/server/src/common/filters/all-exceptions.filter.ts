import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** 全局异常过滤器：所有错误统一为 { code, data: null, message } 结构 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        const raw = (body as { message?: string | string[] }).message;
        message = Array.isArray(raw) ? raw.join('; ') : (raw ?? exception.message);
      }
    } else {
      this.logger.error(String(exception));
    }

    response.status(status).json({ code: status, data: null, message });
  }
}
