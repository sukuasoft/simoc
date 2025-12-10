import { v4 as uuidv4 } from 'uuid';

export type AlertType = 'down' | 'up' | 'warning' | 'slow_response';
export type AlertChannel = 'email' | 'sms' | 'both';
export type AlertStatus = 'pending' | 'sent' | 'failed';

export interface AlertProps {
  id?: string;
  deviceId: string;
  deviceName: string;
  type: AlertType;
  message: string;
  channel: AlertChannel;
  status: AlertStatus;
  recipientEmail?: string;
  recipientPhone?: string;
  sentAt?: Date;
  createdAt?: Date;
}

export class Alert {
  public readonly id: string;
  public readonly deviceId: string;
  public readonly deviceName: string;
  public readonly type: AlertType;
  public readonly message: string;
  public readonly channel: AlertChannel;
  public status: AlertStatus;
  public readonly recipientEmail?: string;
  public readonly recipientPhone?: string;
  public sentAt?: Date;
  public readonly createdAt: Date;

  constructor(props: AlertProps) {
    this.id = props.id || uuidv4();
    this.deviceId = props.deviceId;
    this.deviceName = props.deviceName;
    this.type = props.type;
    this.message = props.message;
    this.channel = props.channel;
    this.status = props.status;
    this.recipientEmail = props.recipientEmail;
    this.recipientPhone = props.recipientPhone;
    this.sentAt = props.sentAt;
    this.createdAt = props.createdAt || new Date();
  }

  static create(
    deviceId: string,
    deviceName: string,
    type: AlertType,
    channel: AlertChannel,
    recipientEmail?: string,
    recipientPhone?: string
  ): Alert {
    const messages: Record<AlertType, string> = {
      down: `🚨 ALERTA: O dispositivo "${deviceName}" está OFFLINE!`,
      up: `✅ RECUPERADO: O dispositivo "${deviceName}" está novamente ONLINE!`,
      warning: `⚠️ AVISO: O dispositivo "${deviceName}" apresenta anomalias.`,
      slow_response: `🐢 LENTIDÃO: O dispositivo "${deviceName}" está com resposta lenta.`,
    };

    return new Alert({
      deviceId,
      deviceName,
      type,
      message: messages[type],
      channel,
      status: 'pending',
      recipientEmail,
      recipientPhone,
    });
  }

  markAsSent(): void {
    this.status = 'sent';
    this.sentAt = new Date();
  }

  markAsFailed(): void {
    this.status = 'failed';
  }

  toJSON() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      type: this.type,
      message: this.message,
      channel: this.channel,
      status: this.status,
      recipientEmail: this.recipientEmail,
      recipientPhone: this.recipientPhone,
      sentAt: this.sentAt,
      createdAt: this.createdAt,
    };
  }
}
