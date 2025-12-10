import { v4 as uuidv4 } from 'uuid';

export interface UserProps {
  id?: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  password: string;
  notifyByEmail: boolean;
  notifyBySms: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public email: string;
  public name: string;
  public phone: string;
  public isActive: boolean;
  public notifyByEmail: boolean;
  public notifyBySms: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public password: string;

  constructor(props: UserProps) {
    this.id = props.id || uuidv4();
    this.email = props.email;
    this.name = props.name;
    this.phone = props.phone;
    this.isActive = props.isActive;
    this.notifyByEmail = props.notifyByEmail;
    this.notifyBySms = props.notifyBySms;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.password=props.password;
  }

  static create(
    email: string,
    name: string,
    password: string,
    phone: string
  ): User {
    return new User({
      email,
      name,
      phone,
      password,
      isActive: true,
      notifyByEmail: true,
      notifyBySms: !!phone,
    });
  }

  getNotificationChannel(): 'email' | 'sms' | 'both' | 'none' {
    if (this.notifyByEmail && this.notifyBySms && this.phone) return 'both';
    if (this.notifyByEmail) return 'email';
    if (this.notifyBySms && this.phone) return 'sms';
    return 'none';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      phone: this.phone,
      isActive: this.isActive,
      notifyByEmail: this.notifyByEmail,
      notifyBySms: this.notifyBySms,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
