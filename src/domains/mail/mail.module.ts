import { Module } from '@nestjs/common';
import { SendgridMailService } from './service/sendgrid.mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule
  ],
  providers: [
    {
      provide: 'IMailService',
      useClass: SendgridMailService
    }
  ],
  exports: [
    {
      provide: 'IMailService',
      useClass: SendgridMailService
    }
  ]
})
export class MailModule {}
