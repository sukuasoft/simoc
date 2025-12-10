import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseConfig {
  private static instance: SupabaseClient | null = null;

  static getClient(): SupabaseClient {
    if (!this.instance) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      this.instance = createClient(supabaseUrl, supabaseKey);
    }

    return this.instance;
  }
}

// Database types
export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string;
          name: string;
          type: string;
          host: string;
          port: number | null;
          check_type: string;
          check_interval: number;
          timeout: number;
          status: string;
          last_check: string | null;
          last_response_time: number | null;
          is_active: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          host: string;
          port?: number | null;
          check_type: string;
          check_interval?: number;
          timeout?: number;
          status?: string;
          last_check?: string | null;
          last_response_time?: number | null;
          is_active?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          host?: string;
          port?: number | null;
          check_type?: string;
          check_interval?: number;
          timeout?: number;
          status?: string;
          last_check?: string | null;
          last_response_time?: number | null;
          is_active?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      monitoring_logs: {
        Row: {
          id: string;
          device_id: string;
          status: string;
          response_time: number | null;
          error_message: string | null;
          checked_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          status: string;
          response_time?: number | null;
          error_message?: string | null;
          checked_at?: string;
        };
        Update: {
          id?: string;
          device_id?: string;
          status?: string;
          response_time?: number | null;
          error_message?: string | null;
          checked_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          device_id: string;
          device_name: string;
          type: string;
          message: string;
          channel: string;
          status: string;
          recipient_email: string | null;
          recipient_phone: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          device_name: string;
          type: string;
          message: string;
          channel: string;
          status?: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          device_id?: string;
          device_name?: string;
          type?: string;
          message?: string;
          channel?: string;
          status?: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
