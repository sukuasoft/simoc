import { INotificationService } from '../../../application/use-cases/alert/SendAlertUseCase';
import { ResendEmailService } from './ResendEmailService';
import { VonageSmsService } from './VonageSmsService';

export class NotificationService implements INotificationService {
  private emailService: ResendEmailService | null = null;
  private smsService: VonageSmsService | null = null;

  constructor() {
    // Inicializa serviços apenas se as credenciais estiverem disponíveis
    try {
      this.emailService = new ResendEmailService();
    } catch (error) {
      console.warn('⚠️ Email service not configured:', (error as Error).message);
    }

    try {
      this.smsService = new VonageSmsService();
    } catch (error) {
      console.warn('⚠️ SMS service not configured:', (error as Error).message);
    }
  }

  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    if (!this.emailService) {
      console.warn('Email service not available');
      return false;
    }
    return this.emailService.sendEmail(to, subject, message);
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.smsService) {
      console.warn('SMS service not available');
      return false;
    }
    return this.smsService.sendSMS(to, message);
  }
}
