# 🖥️ SIMOC - Sistema de Monitoramento Corporativo

Sistema Inteligente de Monitoramento de Infraestruturas de Redes, capaz de verificar automaticamente o estado de servidores, routers, switches, APIs, domínios, portas e outros serviços.

## ✨ Funcionalidades

- **Monitoramento Automático**: Verificação contínua de dispositivos e serviços
- **Dashboard em Tempo Real**: Gráficos, logs, estatísticas e status
- **Alertas Instantâneos**: Notificações por Email (Resend) e SMS (Vonage)
- **Autenticação Segura**: Integração com Supabase Auth
- **Histórico Completo**: Logs de monitoramento e alertas

## 🛠️ Tecnologias

### Backend
- **Node.js + Express + TypeScript**
- **DDD (Domain-Driven Design)**

### Banco de Dados & Auth
- **Supabase**: PostgreSQL, Autenticação, RLS

### Notificações
- **Resend**: Envio de emails
- **Vonage (Nexmo)**: Envio de SMS

## 📁 Estrutura do Projeto (DDD)

```
src/
├── domain/                    # Camada de Domínio
│   ├── entities/              # Entidades (Device, Alert, User, MonitoringLog)
│   └── repositories/          # Interfaces dos repositórios
├── application/               # Camada de Aplicação
│   ├── dtos/                  # Data Transfer Objects
│   └── use-cases/             # Casos de uso
│       ├── device/            # CRUD de dispositivos
│       ├── monitoring/        # Verificação de saúde e stats
│       └── alert/             # Envio e listagem de alertas
├── infrastructure/            # Camada de Infraestrutura
│   ├── database/              # Supabase config e schema
│   ├── repositories/          # Implementações Supabase
│   └── services/              # Serviços externos
│       ├── monitoring/        # HealthChecker, MonitoringScheduler
│       └── notifications/     # Resend (email), Vonage (SMS)
└── interfaces/                # Camada de Interface
    ├── controllers/           # Controllers HTTP
    ├── routes/                # Rotas da API
    └── middlewares/           # Auth e error handling
```

## 🚀 Como executar

### 1. Instalar dependências
```bash
yarn install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com suas credenciais
```

### 3. Configurar Supabase
1. Criar projeto em [supabase.com](https://supabase.com)
2. Executar o SQL em `src/infrastructure/database/schema.sql`
3. Copiar URL e ANON_KEY para o `.env`

### 4. Executar em modo de desenvolvimento
```bash
yarn dev
```

## 📚 Endpoints da API

### Devices (Dispositivos)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/devices` | Criar novo dispositivo |
| `GET` | `/api/devices` | Listar todos os dispositivos |
| `GET` | `/api/devices/:id` | Buscar dispositivo por ID |
| `PUT` | `/api/devices/:id` | Atualizar dispositivo |
| `DELETE` | `/api/devices/:id` | Deletar dispositivo |
| `POST` | `/api/devices/:id/check` | Verificar saúde do dispositivo |

**Criar Dispositivo:**
```json
{
  "name": "Servidor Web Principal",
  "type": "server",
  "host": "192.168.1.100",
  "port": 443,
  "checkType": "https",
  "checkInterval": 60,
  "timeout": 5000
}
```

**Tipos de Dispositivo:** `server`, `router`, `switch`, `api`, `domain`, `port`, `service`

**Tipos de Verificação:** `ping`, `http`, `https`, `tcp`, `dns`

### Monitoring (Monitoramento)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/monitoring/dashboard` | Estatísticas do dashboard |
| `GET` | `/api/monitoring/logs/:deviceId` | Logs de um dispositivo |
| `GET` | `/api/monitoring/logs/:deviceId/range` | Logs por período |

### Alerts (Alertas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/alerts` | Listar alertas |
| `GET` | `/api/alerts/pending` | Alertas pendentes |
| `POST` | `/api/alerts/test` | Enviar alerta de teste |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status da API |
| `GET` | `/api` | Informações da API |

## 🏗️ Arquitetura DDD

### Domain Layer
- **Entities**: Device, User, Alert, MonitoringLog
- **Repository Interfaces**: Contratos para acesso a dados

### Application Layer
- **Use Cases**: Lógica de aplicação e orquestração
- **DTOs**: Objetos para transferência de dados entre camadas

### Infrastructure Layer
- **Supabase Repositories**: Implementações concretas com PostgreSQL
- **Notification Services**: Resend (email) e Vonage (SMS)
- **Monitoring Services**: HealthChecker e MonitoringScheduler

### Interface Layer
- **Controllers**: Manipulação de requisições HTTP
- **Routes**: Definição de rotas RESTful
- **Middlewares**: Autenticação e tratamento de erros

## 🔧 Variáveis de Ambiente

```env
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=alerts@yourdomain.com

# Vonage (SMS)
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=SIMOC

# Alert Recipients
ALERT_EMAIL=admin@yourdomain.com
ALERT_PHONE=+5511999999999
```

## 🛠️ Tecnologias

- Node.js
- Express
- TypeScript
- Supabase (PostgreSQL + Auth)
- Resend (Email)
- Vonage/Nexmo (SMS)
- DDD (Domain-Driven Design)
- node-cron (Agendamento)

## 📄 Licença

MIT
