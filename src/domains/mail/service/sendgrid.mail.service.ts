import { Injectable } from '@nestjs/common';
import { IMailService } from './mail.service.interface';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendgridMailService implements IMailService{

  constructor(private readonly config: ConfigService) {
    SendGrid.setApiKey(config.get("SENDGRID_API_KEY"))
  }

  async sendEmail(to: string, template_id: string, templateArgs: any): Promise<void> {
    try {
      await SendGrid.send({
        to: to,
        from: this.config.get("SENDGRID_EMAIL"),
        templateId: template_id,
        dynamicTemplateData: templateArgs
      })
    } catch (e) {
      console.error(JSON.stringify(e.response.body))
    }
  }

}
