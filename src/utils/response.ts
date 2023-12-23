import { ValidationError } from 'yup';

export class OkResponse extends Response {
  constructor(data: unknown, status = 200) {
    super(JSON.stringify(data), { status });
  }
}

export class ErrorResponse extends Response {
  constructor(message: string, status: number, details?: any) {
    super(JSON.stringify({ error: message, details }), { status });
  }
}

export class ValidationErrorResponse extends ErrorResponse {
  constructor(error: ValidationError) {
    super('Request validation error', 400, error.errors);
  }
}

export class UnauthorizedErrorResponse extends ErrorResponse {
  constructor(message?: string) {
    super(message ? `Unauthorized: ${message}` : 'Unauthorized', 401);
  }
}

export class NotFoundErrorResponse extends ErrorResponse {
  constructor(item: string) {
    super(`${item} not found`, 404);
  }
}
