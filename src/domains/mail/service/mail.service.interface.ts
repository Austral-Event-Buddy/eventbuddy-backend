export interface IMailService {
  sendEmail(to: String, subject: String, body: String): void
}
