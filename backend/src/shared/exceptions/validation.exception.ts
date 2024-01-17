import { BadRequestException } from '@nestjs/common';

export class ValidationError extends BadRequestException {
  constructor(objectOrError?: string | object | any) {
    super(objectOrError, 'Validation Error');
  }
}
