import axios from 'axios'

// OpenAI Service
export class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
  }

  async sendMessage(messages) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('Erro ao enviar mensagem para OpenAI:', error)
      throw new Error('Erro ao processar mensagem')
    }
  }
}

// Payment Gateway Service
export class PaymentService {
  constructor() {
    this.secretKey = import.meta.env.VITE_PAYMENT_SECRET_KEY
    this.publicKey = import.meta.env.VITE_PAYMENT_PUBLIC_KEY
    this.apiUrl = import.meta.env.VITE_PAYMENT_API_URL
  }

  async createPixPayment(customerData, amount, items) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/transaction.purchase`,
        {
          name: customerData.name,
          email: customerData.email,
          cpf: customerData.cpf,
          phone: customerData.phone,
          paymentMethod: 'PIX',
          amount: amount * 100, // Converter para centavos
          traceable: true,
          items: items.map(item => ({
            unitPrice: item.price * 100,
            title: item.title,
            quantity: 1,
            tangible: false
          })),
          externalId: `shapebot_${Date.now()}`,
          postbackUrl: `${import.meta.env.VITE_APP_URL}/webhook/payment`
        },
        {
          headers: {
            'Authorization': this.secretKey,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error)
      throw new Error('Erro ao processar pagamento')
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/transaction.getPayment?id=${paymentId}`,
        {
          headers: {
            'Authorization': this.secretKey
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error)
      throw new Error('Erro ao verificar pagamento')
    }
  }
}

// UTMify Service
export class UTMifyService {
  constructor() {
    this.apiToken = import.meta.env.VITE_UTMIFY_API_TOKEN
    this.apiUrl = import.meta.env.VITE_UTMIFY_API_URL
  }

  async sendOrder(orderData) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/orders`,
        orderData,
        {
          headers: {
            'x-api-token': this.apiToken,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao enviar pedido para UTMify:', error)
      throw new Error('Erro ao rastrear pedido')
    }
  }

  extractUTMParams() {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      src: urlParams.get('src') || null,
      sck: urlParams.get('sck') || null,
      utm_source: urlParams.get('utm_source') || null,
      utm_campaign: urlParams.get('utm_campaign') || null,
      utm_medium: urlParams.get('utm_medium') || null,
      utm_content: urlParams.get('utm_content') || null,
      utm_term: urlParams.get('utm_term') || null
    }
  }

  async trackPurchase(paymentData, customerData, utmParams) {
    const orderData = {
      orderId: paymentData.id,
      platform: 'ShapeBot AI',
      paymentMethod: 'pix',
      status: paymentData.status === 'APPROVED' ? 'paid' : 'waiting_payment',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      approvedDate: paymentData.approvedAt ? 
        new Date(paymentData.approvedAt).toISOString().replace('T', ' ').slice(0, 19) : null,
      refundedAt: null,
      customer: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        document: customerData.cpf,
        country: 'BR',
        ip: null
      },
      products: [{
        id: paymentData.items[0]?.id || 'shapebot_plan',
        name: paymentData.items[0]?.title || 'Plano ShapeBot AI',
        planId: null,
        planName: null,
        quantity: 1,
        priceInCents: paymentData.amount
      }],
      trackingParameters: utmParams,
      commission: {
        totalPriceInCents: paymentData.amount,
        gatewayFeeInCents: Math.round(paymentData.amount * 0.05), // 5% de taxa
        userCommissionInCents: Math.round(paymentData.amount * 0.95)
      },
      isTest: false
    }

    return this.sendOrder(orderData)
  }
}

// Instâncias dos serviços
export const openAIService = new OpenAIService()
export const paymentService = new PaymentService()
export const utmifyService = new UTMifyService()

