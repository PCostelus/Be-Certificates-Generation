export class Return {
  statusCode: number;

  message: [string];

  error: string;

  constructor(statusCode = 200, message = 'Success', error: string = null) {
    this.statusCode = statusCode;
    this.message = [message];
    this.error = error;
  }
}
