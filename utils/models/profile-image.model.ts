export class ProfileImage {
  public id: string = '';
  public imageLink: string = '';
  public storageUuid: string = '';

  constructor(id: string, imageLink: string, storageUuid: string) {
    this.id = id;
    this.imageLink = imageLink;
    this.storageUuid = storageUuid;
  }

  static empty(): ProfileImage {
    return new ProfileImage('', '', '');
  }

  static fromJson(json: any): ProfileImage {
    return new ProfileImage(json.id ?? '', json.imageLink ?? '', json.storageUuid ?? '');
  }

  toJson(): { id: string; imageLink: string; storageUuid: string } {
    return {
      id: this.id,
      imageLink: this.imageLink,
      storageUuid: this.storageUuid,
    };
  }
}

