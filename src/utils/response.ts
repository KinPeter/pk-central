import { ValidationError } from 'yup';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export class OkResponse extends Response {
  constructor(data: unknown, status = 200) {
    super(JSON.stringify(data), { status, headers: { ...corsHeaders } });
  }
}

export class CorsOkResponse extends Response {
  constructor() {
    super('ok', { headers: corsHeaders });
  }
}

export class ErrorResponse extends Response {
  constructor(message: string, status: number, details?: any) {
    super(JSON.stringify({ error: message, details }), { status, headers: { ...corsHeaders } });
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
