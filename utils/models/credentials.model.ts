import { Account } from './account.model';

export class Credentials {
  public id: string = '';
  public emailAddress: string = '';
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
  public account: Account = Account.empty();

  constructor(
    id: string,
    emailAddress: string,
    createdAt: Date,
    updatedAt: Date,
    account: Account
  ) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.account = account;
  }

  static empty(): Credentials {
    return new Credentials('', '', new Date(), new Date(), Account.empty());
  }

  static fromJson(json: any): Credentials {
    const account = Account.fromJson(json.account ?? {});

    return new Credentials(
      json.id ?? '',
      json.id ?? '',
      json.createdAt ? new Date(json.createdAt) : new Date(),
      json.updatedAt ? new Date(json.updatedAt) : new Date(),
      account
    );
  }

  toJson(): {
    id: string;
    emailAddress: string;
    createdAt: string;
    updatedAt: string;
    account: { id: string; name: string; username: string };
  } {
    return {
      id: this.id,
      emailAddress: this.emailAddress,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      account: this.account.toJson(),
    };
  }
}

