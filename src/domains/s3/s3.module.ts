import {Module} from "@nestjs/common";
import {S3Service} from "./service/s3.service";
import {ConfigModule} from "@nestjs/config";
import {IS3Service} from "./service/s3.service.interface";

const s3ServiceProvider = {
    provide: IS3Service,
    useClass: S3Service
}

@Module({
    controllers: [],
    providers: [s3ServiceProvider],
    imports: [ConfigModule],
    exports: [IS3Service]
})
export class S3Module {}