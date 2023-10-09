import { Injectable } from '@nestjs/common';
import { IMailService } from './mail.service.interface';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendgridMailService implements IMailService{

  constructor(private readonly config: ConfigService) {
    SendGrid.setApiKey(config.get("SENDGRID_API_KEY"))
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await SendGrid.send({
      to: to,
      from: this.config.get("SENDGRID_EMAIL"),
      subject: subject,
      text: body,
    })
  }

}
