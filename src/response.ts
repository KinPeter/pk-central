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
