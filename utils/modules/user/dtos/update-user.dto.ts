export class UpdateUserDto {
  public username: string = '';
  public name: string = '';

  constructor(username: string, name: string) {
    this.name = name;
    this.username = username;
  }

  static empty(): UpdateUserDto {
    return new UpdateUserDto('', '');
  }

  static fromJson(json: any): UpdateUserDto {
    return new UpdateUserDto(json.username ?? '', json.name ?? '');
  }

  toJson(): { username: string; name: string } {
    return {
      username: this.username,
      name: this.name,
    };
  }
}

