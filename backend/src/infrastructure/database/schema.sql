-- Tabela de dispositivos
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('server', 'router', 'switch', 'api', 'domain', 'port', 'service')),
  host VARCHAR(255) NOT NULL,
  port INTEGER,
  check_type VARCHAR(50) NOT NULL CHECK (check_type IN ('ping', 'http', 'https', 'tcp', 'dns')),
  check_interval INTEGER NOT NULL DEFAULT 60,
  timeout INTEGER NOT NULL DEFAULT 5000,
  status VARCHAR(50) NOT NULL DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'warning', 'unknown')),
  last_check TIMESTAMP WITH TIME ZONE,
  last_response_time INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de logs de monitoramento
CREATE TABLE IF NOT EXISTS monitoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('online', 'offline', 'warning', 'unknown')),
  response_time INTEGER,
  error_message TEXT,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de alertas
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  device_name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('down', 'up', 'warning', 'slow_response')),
  message TEXT NOT NULL,
  channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'sms', 'both')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de perfis de usuários (extende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'operator', 'viewer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notify_by_email BOOLEAN NOT NULL DEFAULT true,
  notify_by_sms BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_devices_is_active ON devices(is_active);
CREATE INDEX IF NOT EXISTS idx_monitoring_logs_device_id ON monitoring_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_logs_checked_at ON monitoring_logs(checked_at);
CREATE INDEX IF NOT EXISTS idx_alerts_device_id ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

-- RLS (Row Level Security)
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para devices
CREATE POLICY "Users can view their own devices" ON devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own devices" ON devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" ON devices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" ON devices
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para monitoring_logs
CREATE POLICY "Users can view logs of their devices" ON monitoring_logs
  FOR SELECT USING (
    device_id IN (SELECT id FROM devices WHERE user_id = auth.uid())
  );

-- Políticas de segurança para alerts
CREATE POLICY "Users can view alerts of their devices" ON alerts
  FOR SELECT USING (
    device_id IN (SELECT id FROM devices WHERE user_id = auth.uid())
  );

-- Políticas de segurança para profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
