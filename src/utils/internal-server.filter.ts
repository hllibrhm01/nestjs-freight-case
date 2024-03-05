import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    InternalServerErrorException
  } from '@nestjs/common';
  import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const STATUS_CODE = 500;

    response.status(STATUS_CODE).json({
      statusCode: STATUS_CODE,
      message: response.statusMessage
      
    });
  }
}
