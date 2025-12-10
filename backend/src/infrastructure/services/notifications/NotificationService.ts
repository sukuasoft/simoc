import { INotificationService } from '../../../application/use-cases/alert/SendAlertUseCase';
import { ResendEmailService } from './ResendEmailService';
import { OmbalaSmsService } from './OmbalaSmsService';


export class NotificationService implements INotificationService {
  private emailService: ResendEmailService | null = null;
  private ombalaSmsService: OmbalaSmsService | null = null;

  constructor() {

    // Inicializa serviços apenas se as credenciais estiverem disponíveis
    try {
      this.emailService = new ResendEmailService();
    } catch (error) {
      console.warn('⚠️ Email service not configured:', (error as Error).message);
    }

    // Tenta inicializar Ombala SMS
    try {
      this.ombalaSmsService = new OmbalaSmsService();
      console.log('✅ Ombala SMS service configured');
    } catch (error) {
      console.warn('⚠️ Ombala SMS service not configured:', (error as Error).message);
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

    if (this.ombalaSmsService) {
      return this.ombalaSmsService.sendSMS(to, message);
    }

    console.warn('No SMS service available');
    return false;
  }

  async sendScheduledSMS(to: string, message: string, scheduleDate: string): Promise<boolean> {
    if (!this.ombalaSmsService) {
      console.warn('Ombala SMS service not available for scheduled messages');
      return false;
    }
    return this.ombalaSmsService.sendScheduledSMS(to, message, scheduleDate);
  }
}
