export class Account {
  public id: string = '';
  public name: string = '';
  public username: string = '';

  constructor(id: string, name: string, username: string) {
    this.id = id;
    this.name = name;
    this.username = username;
  }

  static empty(): Account {
    return new Account('', '', '');
  }

  static fromJson(json: any): Account {
    return new Account(json.id ?? '', json.name ?? '', json.username ?? '');
  }

  toJson(): { id: string; name: string; username: string } {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
    };
  }
}

