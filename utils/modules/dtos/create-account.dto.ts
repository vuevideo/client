export class CreateAccountDto {
  public emailAddress: string = '';
  public username: string = '';
  public password: string = '';
  public name: string = '';

  constructor(
    emailAddress: string,
    username: string,
    password: string,
    name: string
  ) {
    this.emailAddress = emailAddress;
    this.username = username;
    this.password = password;
    this.name = name;
  }

  static empty(): CreateAccountDto {
    return new CreateAccountDto('', '', '', '');
  }

  static fromJson(json: any): CreateAccountDto {
    return new CreateAccountDto(
      json.emailAddress ?? '',
      json.username ?? '',
      json.password ?? '',
      json.name ?? ''
    );
  }

  toJson(): {
    emailAddress: string;
    username: string;
    password: string;
    name: string;
  } {
    return {
      emailAddress: this.emailAddress,
      username: this.username,
      password: this.password,
      name: this.name,
    };
  }
}

