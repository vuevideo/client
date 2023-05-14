export class HttpException {
  public statusCode: number = 0;
  public message: string = '';
  public error: string = '';

  constructor(statusCode: number, message: string, error: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }

  static empty(): HttpException {
    return new HttpException(0, '', '');
  }

  static fromJson(json: any): HttpException {
    return new HttpException(
      json.statusCode ?? '',
      json.message ?? '',
      json.error ?? ''
    );
  }

  toJson(): { statusCode: number; message: string; error: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.error,
    };
  }

  isEmpty(): boolean {
    return this.statusCode === 0 && this.message === '' && this.error === '';
  }
}

