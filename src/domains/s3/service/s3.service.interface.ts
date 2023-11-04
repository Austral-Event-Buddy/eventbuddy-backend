export abstract class IS3Service {
    abstract uploadFile(path: string): Promise<string>;
    abstract getSignedUrl(path: string): Promise<string>;
    abstract deleteFile(path: string): Promise<void>;
}