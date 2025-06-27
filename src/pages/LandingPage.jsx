import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Users, Zap, Target, Heart, ArrowRight, Play } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Planos 100% Personalizados",
      description: "IA que age como nutricionista, coach e personal trainer"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Resultados Rápidos",
      description: "Veja mudanças reais em poucas semanas"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Acompanhamento Diário",
      description: "Motivação e suporte todos os dias"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunidade Ativa",
      description: "Mais de 10.000 pessoas transformando suas vidas"
    }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      result: "Perdeu 8kg em 6 semanas",
      text: "O ShapeBot mudou minha vida! Os planos são super fáceis de seguir e realmente funcionam.",
      rating: 5
    },
    {
      name: "João Santos",
      result: "Perdeu 12kg em 3 meses",
      text: "Nunca pensei que seria tão simples. A IA entende exatamente o que eu preciso.",
      rating: 5
    },
    {
      name: "Ana Costa",
      result: "Perdeu 6kg em 4 semanas",
      text: "Finalmente encontrei algo que funciona para mim. Recomendo para todos!",
      rating: 5
    }
  ]

  const plans = [
    {
      name: "Trial Gratuito",
      price: "R$ 0",
      period: "3 dias",
      features: [
        "5 mensagens por dia",
        "Plano alimentar básico",
        "Suporte por chat"
      ],
      popular: false,
      cta: "Começar Grátis"
    },
    {
      name: "Plano Padrão",
      price: "R$ 29,90",
      period: "por mês",
      features: [
        "Mensagens ilimitadas",
        "Planos personalizados completos",
        "Treinos detalhados",
        "Acompanhamento diário",
        "Suporte prioritário"
      ],
      popular: true,
      cta: "Assinar Agora"
    },
    {
      name: "Plano Premium",
      price: "R$ 59,90",
      period: "por mês",
      features: [
        "Tudo do Plano Padrão",
        "Relatórios semanais",
        "Conteúdos exclusivos",
        "Consultoria personalizada",
        "Acesso antecipado a novidades"
      ],
      popular: false,
      cta: "Assinar Premium"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ShapeBot AI</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Entrar
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
          🔥 Mais de 10.000 pessoas já transformaram suas vidas
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Emagreça com
          <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> IA Personalizada</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          O ShapeBot AI é seu coach, nutricionista e personal trainer em um só lugar. 
          Planos 100% personalizados que se adaptam ao seu estilo de vida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg"
            onClick={() => navigate('/login')}
          >
            Teste Grátis por 3 Dias
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
            onClick={() => setIsVideoPlaying(true)}
          >
            <Play className="mr-2 h-5 w-5" />
            Ver Como Funciona
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-blue-600">10K+</div>
            <div className="text-gray-600">Usuários Ativos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">95%</div>
            <div className="text-gray-600">Taxa de Sucesso</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">4.9★</div>
            <div className="text-gray-600">Avaliação</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Por que o ShapeBot AI é diferente?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nossa inteligência artificial aprende com você e cria planos únicos que realmente funcionam.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white/50 backdrop-blur py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resultados Reais de Pessoas Reais
            </h2>
            <p className="text-gray-600">
              Veja o que nossos usuários estão dizendo sobre suas transformações.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit bg-green-100 text-green-800">
                    {testimonial.result}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal para Você
          </h2>
          <p className="text-gray-600">
            Comece grátis e veja os resultados. Depois escolha o plano que mais se adapta ao seu objetivo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border-gray-200'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => navigate('/login')}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Transformar Sua Vida?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram o poder da IA para emagrecer de forma saudável e sustentável.
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/login')}
          >
            Começar Minha Transformação Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">ShapeBot AI</span>
              </div>
              <p className="text-gray-400">
                Transformando vidas através da inteligência artificial.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Como Funciona</li>
                <li>Planos</li>
                <li>Resultados</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Termos de Uso</li>
                <li>Privacidade</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShapeBot AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

