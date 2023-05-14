export class LoginAccountDto {
  public emailAddress: string = '';
  public password: string = '';

  constructor(emailAddress: string, password: string) {
    this.emailAddress = emailAddress;
    this.password = password;
  }

  static empty(): LoginAccountDto {
    return new LoginAccountDto('', '');
  }

  static fromJson(json: any): LoginAccountDto {
    return new LoginAccountDto(json.emailAddress ?? '', json.password ?? '');
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

