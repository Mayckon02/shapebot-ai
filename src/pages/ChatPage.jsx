import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import { openAIService } from '../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Send, 
  Bot, 
  User, 
  Crown, 
  MessageCircle, 
  Settings, 
  LogOut,
  Zap,
  Lock
} from 'lucide-react'

export default function ChatPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { 
    userProfile, 
    chatHistory, 
    dailyMessageCount, 
    addMessage, 
    canSendMessage, 
    generateShapeBotPrompt 
  } = useUser()
  
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  useEffect(() => {
    // Se não tem perfil, redirecionar para onboarding
    if (!userProfile) {
      navigate('/onboarding')
      return
    }

    // Mensagem de boas-vindas se for o primeiro acesso
    if (chatHistory.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Olá! Eu sou o ShapeBot AI, seu assistente pessoal para emagrecimento! 🎯

Analisei seu perfil e estou pronto para te ajudar a alcançar sua meta de perder ${userProfile.meta_kg}kg em ${userProfile.tempo_metas} semanas.

Vou te acompanhar em 3 etapas:
🍽️ **Plano Alimentar Personalizado**
💪 **Motivação e Apoio Diário** 
🏃 **Treinos Adaptados ao seu Tempo**

Para começar, me conte: **o que você costuma comer no café da manhã, almoço, jantar e nos lanches?** Seja bem detalhado para eu criar o plano perfeito para você!`,
        timestamp: new Date().toISOString()
      }
      addMessage(welcomeMessage)
    }
  }, [userProfile, chatHistory.length, navigate, addMessage])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    // Verificar limite de mensagens
    if (!canSendMessage(user?.plan)) {
      setShowUpgradeAlert(true)
      return
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    addMessage(userMessage)
    setMessage('')
    setIsLoading(true)

    try {
      // Preparar contexto para a IA
      const systemPrompt = generateShapeBotPrompt()
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.slice(-10).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message.trim() }
      ]

      const response = await openAIService.sendMessage(conversationHistory)

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date().toISOString()
      }

      addMessage(botMessage)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date().toISOString()
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content) => {
    // Converter markdown básico para HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/🔹/g, '<br/>🔹')
      .replace(/\n/g, '<br/>')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (!userProfile) {
    return null // Será redirecionado pelo useEffect
  }

  const remainingMessages = user?.plan === 'free' ? Math.max(0, 5 - dailyMessageCount) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ShapeBot AI</span>
              </div>
              
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Bot className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Plan Badge */}
              <Badge 
                variant={user?.plan === 'free' ? 'secondary' : 'default'}
                className={user?.plan === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}
              >
                {user?.plan === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                {user?.plan === 'free' ? 'Gratuito' : user?.plan === 'standard' ? 'Padrão' : 'Premium'}
              </Badge>

              {/* Message Counter for Free Plan */}
              {user?.plan === 'free' && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {remainingMessages} restantes hoje
                </Badge>
              )}

              {/* Menu */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Upgrade Alert */}
      {showUpgradeAlert && (
        <Alert className="mx-4 mt-4 border-orange-200 bg-orange-50">
          <Lock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-800">
              Você atingiu o limite diário de mensagens. Faça upgrade para continuar conversando!
            </span>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              onClick={() => navigate('/checkout')}
            >
              <Zap className="h-3 w-3 mr-1" />
              Fazer Upgrade
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-xl border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">ShapeBot AI</h2>
                <p className="text-sm text-gray-600">Seu coach pessoal de emagrecimento</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={msg.type === 'user' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                    }>
                      {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`rounded-lg p-3 ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                    <div className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isLoading || (user?.plan === 'free' && remainingMessages === 0)}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading || (user?.plan === 'free' && remainingMessages === 0)}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {user?.plan === 'free' && remainingMessages === 0 && (
              <div className="mt-2 text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/checkout')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Fazer upgrade para continuar conversando
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

