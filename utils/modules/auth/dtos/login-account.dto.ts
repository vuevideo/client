export class CreateAccountDto {
  public emailAddress: string = '';
  public password: string = '';

  constructor(emailAddress: string, password: string) {
    this.emailAddress = emailAddress;
    this.password = password;
  }

  static empty(): CreateAccountDto {
    return new CreateAccountDto('', '');
  }

  static fromJson(json: any): CreateAccountDto {
    return new CreateAccountDto(json.emailAddress ?? '', json.password ?? '');
  }

  toJson(): {
    emailAddress: string;
    password: string;
  } {
    return {
      emailAddress: this.emailAddress,
      password: this.password,
    };
  }
}

