import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let message: string = (exception as TypeORMError).message;
    let code: number = (exception as any).code;
    const customResponse = {
      status: 500,
      message: 'Something went wrong, Our best man is looking into the issue',
      type: 'Internal Server Error',
      errors: [{ code: code, message: message }],
      errorCode: 300,
      timestamp: new Date().toISOString(),
    };

    response.status(customResponse.status).json(customResponse);
  }
}
