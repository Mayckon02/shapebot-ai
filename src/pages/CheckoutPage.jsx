import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { paymentService, utmifyService } from '../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Clock, 
  Copy, 
  QrCode, 
  ArrowLeft,
  CreditCard,
  MessageCircle,
  Target,
  Users,
  Heart,
  CheckCircle2,
  Loader2
} from 'lucide-react'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, updateUserPlan } = useAuth()
  
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'standard')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, processing, success, error
  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [utmParams, setUtmParams] = useState({})

  const plans = {
    standard: {
      name: 'Plano Padrão',
      price: 29.90,
      originalPrice: 49.90,
      period: 'mensal',
      features: [
        'Mensagens ilimitadas com ShapeBot AI',
        'Planos alimentares personalizados',
        'Treinos adaptados ao seu perfil',
        'Acompanhamento diário de progresso',
        'Suporte prioritário via chat',
        'Acesso a comunidade exclusiva'
      ],
      popular: true,
      savings: 20
    },
    premium: {
      name: 'Plano Premium',
      price: 59.90,
      originalPrice: 99.90,
      period: 'mensal',
      features: [
        'Tudo do Plano Padrão',
        'Relatórios semanais detalhados',
        'Conteúdos exclusivos e receitas',
        'Consultoria personalizada mensal',
        'Acesso antecipado a novidades',
        'Suporte via WhatsApp direto',
        'Planos para ocasiões especiais'
      ],
      popular: false,
      savings: 40
    }
  }

  useEffect(() => {
    // Capturar parâmetros UTM
    const params = utmifyService.extractUTMParams()
    setUtmParams(params)
  }, [])

  useEffect(() => {
    // Verificar status do pagamento periodicamente
    let interval
    if (paymentData && paymentStatus === 'processing') {
      interval = setInterval(async () => {
        try {
          const status = await paymentService.getPaymentStatus(paymentData.id)
          if (status.status === 'APPROVED') {
            setPaymentStatus('success')
            updateUserPlan(selectedPlan)
            
            // Enviar para UTMify
            try {
              await utmifyService.trackPurchase(status, customerData, utmParams)
            } catch (error) {
              console.error('Erro ao enviar para UTMify:', error)
            }
            
            clearInterval(interval)
          } else if (status.status === 'REJECTED' || status.status === 'EXPIRED') {
            setPaymentStatus('error')
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error)
        }
      }, 5000) // Verificar a cada 5 segundos
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [paymentData, paymentStatus, selectedPlan, updateUserPlan, customerData, utmParams])

  const validateForm = () => {
    const newErrors = {}
    
    if (!customerData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!customerData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!customerData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!/^\d{11}$/.test(customerData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF deve ter 11 dígitos'
    }
    
    if (!customerData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!/^\d{10,11}$/.test(customerData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setPaymentStatus('processing')
    
    try {
      const plan = plans[selectedPlan]
      const cleanCustomerData = {
        ...customerData,
        cpf: customerData.cpf.replace(/\D/g, ''),
        phone: customerData.phone.replace(/\D/g, '')
      }
      
      const payment = await paymentService.createPixPayment(
        cleanCustomerData,
        plan.price,
        [{
          title: plan.name,
          price: plan.price
        }]
      )
      
      setPaymentData(payment)
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      setPaymentStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const copyPixCode = () => {
    if (paymentData?.pixCode) {
      navigator.clipboard.writeText(paymentData.pixCode)
      // Mostrar feedback visual
    }
  }

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const currentPlan = plans[selectedPlan]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/chat')}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ShapeBot AI</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Escolha seu Plano
          </h1>
          <p className="text-gray-600">
            Desbloqueie todo o potencial do ShapeBot AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Selecione seu Plano</span>
                  <Badge className="bg-green-100 text-green-800">
                    Oferta Limitada
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(plans).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          {plan.popular && (
                            <Badge className="bg-blue-500 text-white">
                              Mais Popular
                            </Badge>
                          )}
                          {key === 'premium' && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-2xl font-bold text-green-600">
                            R$ {plan.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-gray-600">/{plan.period}</span>
                          {plan.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              R$ {plan.originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </div>
                        
                        {plan.savings && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 mb-3">
                            Economize R$ {plan.savings.toFixed(2).replace('.', ',')}
                          </Badge>
                        )}
                        
                        <ul className="space-y-1 text-sm">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-blue-600 text-xs">
                              +{plan.features.length - 3} recursos adicionais
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPlan === key
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === key && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features Comparison */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Por que escolher o {currentPlan.name}?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold">Chat Ilimitado</div>
                    <div className="text-sm text-gray-600">Converse sem limites</div>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">Planos Personalizados</div>
                    <div className="text-sm text-gray-600">100% adaptado a você</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold">Comunidade</div>
                    <div className="text-sm text-gray-600">Suporte de outros usuários</div>
                  </div>
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="font-semibold">Acompanhamento</div>
                    <div className="text-sm text-gray-600">Motivação diária</div>
                  </div>
                </div>
                
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Garantia de 7 dias:</strong> Se não ficar satisfeito, devolvemos seu dinheiro.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {paymentStatus === 'pending' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Dados para Pagamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formatCPF(customerData.cpf)}
                      onChange={(e) => setCustomerData({...customerData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={errors.cpf ? 'border-red-500' : ''}
                    />
                    {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formatPhone(customerData.phone)}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plano selecionado:</span>
                      <span className="font-semibold">{currentPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span className="font-semibold">R$ {currentPlan.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {currentPlan.savings && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span>-R$ {currentPlan.savings.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Pagar com PIX
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {paymentStatus === 'processing' && paymentData && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>Pagamento PIX</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      Escaneie o QR Code ou copie o código PIX para finalizar o pagamento.
                    </AlertDescription>
                  </Alert>

                  {paymentData.pixQrCode && (
                    <div className="text-center">
                      <img 
                        src={`data:image/png;base64,${paymentData.pixQrCode}`}
                        alt="QR Code PIX"
                        className="mx-auto mb-4 border rounded-lg"
                      />
                    </div>
                  )}

                  {paymentData.pixCode && (
                    <div className="space-y-2">
                      <Label>Código PIX (Copia e Cola)</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={paymentData.pixCode}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          onClick={copyPixCode}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Aguardando pagamento...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentStatus === 'success' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur border-green-200">
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Pagamento Confirmado!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Seu plano foi ativado com sucesso. Agora você tem acesso completo ao ShapeBot AI!
                  </p>
                  <Button
                    onClick={() => navigate('/chat')}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    Começar a Usar
                  </Button>
                </CardContent>
              </Card>
            )}

            {paymentStatus === 'error' && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur border-red-200">
                <CardContent className="text-center py-8">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">✕</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Erro no Pagamento
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Houve um problema com seu pagamento. Tente novamente ou entre em contato conosco.
                  </p>
                  <Button
                    onClick={() => setPaymentStatus('pending')}
                    variant="outline"
                  >
                    Tentar Novamente
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

