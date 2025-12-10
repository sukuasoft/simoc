import { Resend } from 'resend';
import { INotificationService } from '../../../application/use-cases/alert/SendAlertUseCase';

export class ResendEmailService implements Partial<INotificationService> {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('Missing RESEND_API_KEY environment variable');
    }
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'alerts@simoc.app';
  }

  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `SIMOC Alerts <${this.fromEmail}>`,
        to: [to],
        subject: subject,
        html: this.createEmailTemplate(subject, message),
      });

      if (error) {
        console.error('Resend error:', error);
        return false;
      }

      console.log(`✉️ Email sent successfully to ${to}. ID: ${data?.id}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private createEmailTemplate(subject: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 10px 10px;
          }
          .alert-message {
            font-size: 18px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🖥️ SIMOC</h1>
          <p>Sistema de Monitoramento Corporativo</p>
        </div>
        <div class="content">
          <h2>${subject}</h2>
          <div class="alert-message">
            ${message}
          </div>
          <p>Este alerta foi gerado automaticamente pelo sistema SIMOC.</p>
          <p>Acesse o painel de controle para mais detalhes.</p>
        </div>
        <div class="footer">
          <p>SIMOC - Sistema de Monitoramento Corporativo</p>
          <p>© ${new Date().getFullYear()} Todos os direitos reservados</p>
        </div>
      </body>
      </html>
    `;
  }
}
