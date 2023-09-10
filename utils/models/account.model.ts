import { ProfileImage } from './profile-image.model';

export class Account {
  public id: string = '';
  public name: string = '';
  public username: string = '';
  public image: ProfileImage = ProfileImage.empty();

  constructor(id: string, name: string, username: string, image: ProfileImage) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.image = image;
  }

  static empty(): Account {
    return new Account('', '', '', ProfileImage.empty());
  }

  static fromJson(json: any): Account {
    return new Account(
      json.id ?? '',
      json.name ?? '',
      json.username ?? '',
      json.image ? ProfileImage.fromJson(json.image) : ProfileImage.empty()
    );
  }

  toJson(): {
    id: string;
    name: string;
    username: string;
    image: { id: string; imageLink: string; storageUuid: string };
  } {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      image: this.image.toJson(),
    };
  }
}
