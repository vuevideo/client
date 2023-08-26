export class UpdateProfileImageDto {
  public imageLink: string = '';
  public storageUuid: string = '';

  constructor(imageLink: string, storageUuid: string) {
    this.storageUuid = storageUuid;
    this.imageLink = imageLink;
  }

  static empty(): UpdateProfileImageDto {
    return new UpdateProfileImageDto('', '');
  }

  static fromJson(json: any): UpdateProfileImageDto {
    return new UpdateProfileImageDto(
      json.imageLink ?? '',
      json.storageUuid ?? ''
    );
  }

  toJson(): { imageLink: string; storageUuid: string } {
    return {
      imageLink: this.imageLink,
      storageUuid: this.storageUuid,
    };
  }
}

