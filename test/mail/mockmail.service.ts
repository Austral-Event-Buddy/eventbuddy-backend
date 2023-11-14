import {IMailService} from "../../src/domains/mail/service/mail.service.interface";

export class MockMailService implements IMailService{
    sendEmail(to: string, templateId: string, templateArgs: any): void {
    }

}