export class ProfilePictureDto {
    private url: string;
    constructor(signedUrl: string) {
        this.url = signedUrl;
    }
}