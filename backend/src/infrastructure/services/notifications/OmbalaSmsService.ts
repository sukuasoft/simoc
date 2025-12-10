import { INotificationService } from '../../../application/use-cases/alert/SendAlertUseCase';

interface OmbalaMessageRequest {
  message: string;
  from: string;
  to: string;
  schedule?: string;
}

interface OmbalaMessageResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
}

export class OmbalaSmsService implements Partial<INotificationService> {
  private apiUrl: string;
  private apiKey: string;
  private fromName: string;

  constructor() {
    this.apiUrl = process.env.OMBALA_API_URL || 'https://api.useombala.ao/v1/messages';
    this.apiKey = process.env.OMBALA_API_KEY || '';
    this.fromName = process.env.OMBALA_FROM_NAME || 'SIMOC';

    if (!this.apiKey) {
      throw new Error('Missing OMBALA_API_KEY environment variable');
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // Formatar número de telefone (remover caracteres especiais e adicionar código de Angola se necessário)
      const formattedNumber = this.formatPhoneNumber(to);

      // Truncar mensagem se necessário (SMS tem limite de 160 caracteres)
      const truncatedMessage = message.length > 160
        ? message.substring(0, 157) + '...'
        : message;

      const requestBody: OmbalaMessageRequest = {
        message: truncatedMessage,
        from: this.fromName,
        to: formattedNumber,
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ombala API error (${response.status}):`, errorText);
        return false;
      }

      const data: OmbalaMessageResponse = await response.json();

      if (data.success) {
        console.log(`📱 SMS sent successfully via Ombala to ${to}. ID: ${data.messageId || 'N/A'}`);
        return true;
      } else {
        console.error(`Ombala SMS failed: ${data.error || data.message || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Failed to send SMS via Ombala:', error);
      return false;
    }
  }

  /**
   * Envia SMS agendado
   * @param to Número de destino
   * @param message Mensagem
   * @param scheduleDate Data de agendamento no formato YYYYMMDDHHMMSS (ex: 20231015182000)
   */
  async sendScheduledSMS(to: string, message: string, scheduleDate: string): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(to);

      const truncatedMessage = message.length > 160
        ? message.substring(0, 157) + '...'
        : message;

      const requestBody: OmbalaMessageRequest = {
        message: truncatedMessage,
        from: this.fromName,
        to: formattedNumber,
        schedule: scheduleDate,
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ombala API error (${response.status}):`, errorText);
        return false;
      }

      const data: OmbalaMessageResponse = await response.json();

      if (data.success) {
        console.log(`📱 Scheduled SMS via Ombala to ${to} at ${scheduleDate}. ID: ${data.messageId || 'N/A'}`);
        return true;
      } else {
        console.error(`Ombala scheduled SMS failed: ${data.error || data.message || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Failed to send scheduled SMS via Ombala:', error);
      return false;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, '');

    // Se o número começa com 9 e tem 9 dígitos, é um número angolano sem código do país
    if (cleaned.startsWith('9') && cleaned.length === 9) {
      // Não adiciona código do país, a API Ombala parece aceitar apenas o número local
      return cleaned;
    }

    // Se começa com 244 (código de Angola), remove o código
    if (cleaned.startsWith('244') && cleaned.length === 12) {
      return cleaned.substring(3);
    }

    // Se começa com +244, já foi limpo
    return cleaned;
  }
}
