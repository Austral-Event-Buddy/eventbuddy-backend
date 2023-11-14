import {IS3Service} from "../../../src/domains/s3/service/s3.service.interface";

export class S3ServiceUtil extends IS3Service{
    deleteFile(path: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    getSignedUrl(path: string): Promise<string> {
        return Promise.resolve("");
    }

    uploadFile(path: string): Promise<string> {
        return Promise.resolve("");
    }
}