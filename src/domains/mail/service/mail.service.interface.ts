export interface IMailService {
  sendEmail(to: string, templateId: string, templateArgs: any): void
}
