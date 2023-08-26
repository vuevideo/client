export class UpdateEmailDto {
  public emailAddress: string = '';

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  static empty(): UpdateEmailDto {
    return new UpdateEmailDto('');
  }

  static fromJson(json: any): UpdateEmailDto {
    return new UpdateEmailDto(json.emailAddress ?? '');
  }

  toJson(): { emailAddress: string } {
    return {
      emailAddress: this.emailAddress,
    };
  }
}

