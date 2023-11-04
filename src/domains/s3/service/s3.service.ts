import {IS3Service} from "./s3.service.interface";
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class S3Service implements IS3Service {

    private readonly s3Client: S3Client;

    constructor(private config: ConfigService) {
        this.s3Client = new S3Client({
            maxAttempts: 15,
        });
    }
    async uploadFile(path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.config.get("AWS_BUCKET_NAME"),
            Key: path,
        });

        return await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600
        });
    }
    async getSignedUrl(path: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.config.get("AWS_BUCKET_NAME"),
            Key: path,
        });

        return await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600
        });
    }
    async deleteFile(path: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.config.get("AWS_BUCKET_NAME"),
            Key: path,
        });

        await this.s3Client.send(command);
    }
}