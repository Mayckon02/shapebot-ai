# ShapeBot AI - SaaS de Emagrecimento com IA

Um SaaS completo para emagrecimento com inteligência artificial, incluindo chat personalizado, pagamentos PIX e tracking de conversões.

## 🚀 Funcionalidades

- **Landing Page Profissional**: Página de vendas otimizada para conversão
- **Autenticação Completa**: Login/registro com validação
- **Onboarding Personalizado**: Coleta de dados em 6 etapas
- **Chat com IA**: Integração com OpenAI para coaching personalizado
- **Pagamentos PIX**: Gateway de pagamento com QR Code
- **Tracking UTMify**: Rastreamento completo de campanhas
- **Dashboard**: Painel de controle com métricas e progresso
- **Sistema de Planos**: Gratuito, Padrão e Premium
- **Responsive Design**: Funciona perfeitamente em mobile e desktop

## 🛠️ Tecnologias

- **Frontend**: React + Vite + Tailwind CSS
- **UI Components**: shadcn/ui + Lucide Icons
- **Roteamento**: React Router DOM
- **Estado**: Context API
- **Pagamentos**: Gateway PIX personalizado
- **IA**: OpenAI GPT-3.5-turbo
- **Analytics**: UTMify para tracking
- **Deploy**: Vercel

## 📦 Instalação Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd shapebot-ai-saas
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

4. Preencha as variáveis no arquivo `.env.local`:
```env
# OpenAI API
VITE_OPENAI_API_KEY=sua_chave_openai

# Gateway de Pagamento
VITE_PAYMENT_SECRET_KEY=sua_chave_secreta
VITE_PAYMENT_PUBLIC_KEY=sua_chave_publica
VITE_PAYMENT_API_URL=https://example.com.br/api/v1

# UTMify API
VITE_UTMIFY_API_TOKEN=seu_token_utmify
VITE_UTMIFY_API_URL=https://api.utmify.com.br/api-credentials

# App Config
VITE_APP_URL=http://localhost:5173
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm run dev
```

## 🚀 Deploy no Vercel

### 1. Preparação

1. Faça build local para testar:
```bash
pnpm run build
pnpm run preview
```

2. Commit e push para seu repositório Git

### 2. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:

**Environment Variables:**
```
VITE_OPENAI_API_KEY = sua_chave_openai
VITE_PAYMENT_SECRET_KEY = sua_chave_secreta_gateway
VITE_PAYMENT_PUBLIC_KEY = sua_chave_publica_gateway
VITE_PAYMENT_API_URL = https://example.com.br/api/v1
VITE_UTMIFY_API_TOKEN = seu_token_utmify
VITE_UTMIFY_API_URL = https://api.utmify.com.br/api-credentials
VITE_APP_URL = https://seu-dominio.vercel.app
```

5. Clique em "Deploy"

### 3. Configuração Pós-Deploy

1. **Webhook do Gateway**: Configure a URL do webhook para:
   ```
   https://seu-dominio.vercel.app/webhook/payment
   ```

2. **UTMify**: Atualize a URL da aplicação nas configurações

3. **Domínio Personalizado** (opcional):
   - Vá em Settings > Domains
   - Adicione seu domínio personalizado

## 🔧 Configuração das APIs

### OpenAI API
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma API Key
3. Configure billing se necessário

### Gateway de Pagamento
1. Crie conta na plataforma do gateway
2. Acesse /platform/api-keys
3. Gere suas chaves pública e secreta
4. Configure webhook em /platform/webhooks

### UTMify
1. Crie conta em [app.utmify.com.br](https://app.utmify.com.br)
2. Vá em Integrações > Webhooks > Credenciais de API
3. Crie uma nova credencial

## 📊 Funcionalidades Detalhadas

### Sistema de Planos
- **Gratuito**: 5 mensagens/dia, funcionalidades básicas
- **Padrão (R$ 29,90/mês)**: Mensagens ilimitadas, planos completos
- **Premium (R$ 59,90/mês)**: Tudo + relatórios + consultoria

### Chat Personalizado
- Prompt personalizado baseado no perfil do usuário
- Histórico de conversas salvo localmente
- Limite de mensagens para plano gratuito
- Integração completa com OpenAI

### Pagamentos PIX
- Geração automática de QR Code
- Código PIX para copia e cola
- Verificação automática de status
- Webhook para confirmação

### Tracking e Analytics
- Captura automática de parâmetros UTM
- Envio de dados para UTMify
- Rastreamento completo do funil
- Métricas de conversão

## 🎨 Personalização

### Cores e Branding
Edite as variáveis CSS em `src/App.css`:
```css
:root {
  --primary: sua-cor-primaria;
  --secondary: sua-cor-secundaria;
}
```

### Conteúdo
- Landing page: `src/pages/LandingPage.jsx`
- Prompt do bot: `src/contexts/UserContext.jsx`
- Planos e preços: `src/pages/CheckoutPage.jsx`

## 🐛 Resolução de Problemas

### Erro de Build
```bash
# Limpe o cache e reinstale
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problemas de CORS
- Verifique se as URLs das APIs estão corretas
- Confirme se o domínio está autorizado nas APIs

### Webhook não funciona
- Verifique se a URL está correta no gateway
- Teste com ngrok em desenvolvimento

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação das APIs
2. Teste localmente primeiro
3. Verifique os logs do Vercel
4. Confirme as variáveis de ambiente

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para transformar vidas através da tecnologia**