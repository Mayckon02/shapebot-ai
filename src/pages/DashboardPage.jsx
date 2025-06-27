import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  MessageCircle, 
  Crown, 
  Target, 
  Calendar, 
  TrendingDown, 
  Activity,
  Settings,
  CreditCard,
  LogOut,
  Edit,
  Save,
  X,
  BarChart3,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { userProfile, chatHistory, dailyMessageCount, clearChatHistory } = useUser()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile || {})
  const [currentWeight, setCurrentWeight] = useState('')
  const [weightHistory, setWeightHistory] = useState([])

  useEffect(() => {
    if (userProfile) {
      setEditedProfile(userProfile)
    }
    
    // Carregar histórico de peso do localStorage
    const savedWeights = localStorage.getItem('shapebot_weight_history')
    if (savedWeights) {
      setWeightHistory(JSON.parse(savedWeights))
    }
  }, [userProfile])

  const handleSaveProfile = () => {
    // Aqui você salvaria o perfil atualizado
    setIsEditing(false)
    // saveUserProfile(editedProfile) - implementar se necessário
  }

  const handleAddWeight = () => {
    if (!currentWeight) return
    
    const newEntry = {
      weight: parseFloat(currentWeight),
      date: new Date().toISOString(),
      id: Date.now()
    }
    
    const updatedHistory = [...weightHistory, newEntry]
    setWeightHistory(updatedHistory)
    localStorage.setItem('shapebot_weight_history', JSON.stringify(updatedHistory))
    setCurrentWeight('')
  }

  const calculateProgress = () => {
    if (!userProfile || weightHistory.length === 0) return 0
    
    const initialWeight = parseFloat(userProfile.peso)
    const targetWeight = initialWeight - parseFloat(userProfile.meta_kg)
    const currentWeight = weightHistory[weightHistory.length - 1]?.weight || initialWeight
    
    const progress = ((initialWeight - currentWeight) / (initialWeight - targetWeight)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const getWeightLoss = () => {
    if (!userProfile || weightHistory.length === 0) return 0
    
    const initialWeight = parseFloat(userProfile.peso)
    const currentWeight = weightHistory[weightHistory.length - 1]?.weight || initialWeight
    
    return Math.max(0, initialWeight - currentWeight)
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (!userProfile) {
    navigate('/onboarding')
    return null
  }

  const progress = calculateProgress()
  const weightLoss = getWeightLoss()
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
            </div>

            <div className="flex items-center space-x-4">
              <Badge 
                variant={user?.plan === 'free' ? 'secondary' : 'default'}
                className={user?.plan === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}
              >
                {user?.plan === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                {user?.plan === 'free' ? 'Gratuito' : user?.plan === 'standard' ? 'Padrão' : 'Premium'}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/chat')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
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
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Acompanhe seu progresso e gerencie sua conta.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso Perdido</p>
                  <p className="text-2xl font-bold text-green-600">
                    {weightLoss.toFixed(1)}kg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progresso</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {progress.toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mensagens Hoje</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {user?.plan === 'free' ? `${dailyMessageCount}/5` : dailyMessageCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dias Restantes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {userProfile.tempo_metas * 7}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Seu Progresso</span>
                </CardTitle>
                <CardDescription>
                  Meta: Perder {userProfile.meta_kg}kg em {userProfile.tempo_metas} semanas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso atual</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userProfile.peso}kg</p>
                    <p className="text-sm text-gray-600">Peso Inicial</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {weightHistory.length > 0 
                        ? weightHistory[weightHistory.length - 1].weight.toFixed(1) 
                        : userProfile.peso}kg
                    </p>
                    <p className="text-sm text-gray-600">Peso Atual</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {(parseFloat(userProfile.peso) - parseFloat(userProfile.meta_kg)).toFixed(1)}kg
                    </p>
                    <p className="text-sm text-gray-600">Meta</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="current-weight">Registrar Peso Atual</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="current-weight"
                      type="number"
                      placeholder="Ex: 70.5"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddWeight} disabled={!currentWeight}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat History */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Histórico de Conversas</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/chat')}
                  >
                    Ir para Chat
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de mensagens:</span>
                    <Badge variant="secondary">{chatHistory.length}</Badge>
                  </div>
                  
                  {user?.plan === 'free' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mensagens restantes hoje:</span>
                      <Badge variant={remainingMessages === 0 ? 'destructive' : 'secondary'}>
                        {remainingMessages}
                      </Badge>
                    </div>
                  )}

                  {chatHistory.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Última conversa:</p>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm line-clamp-3">
                          {chatHistory[chatHistory.length - 1]?.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(chatHistory[chatHistory.length - 1]?.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhuma conversa ainda. Comece a conversar com o ShapeBot!
                    </p>
                  )}

                  {user?.plan === 'free' && remainingMessages === 0 && (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      onClick={() => navigate('/checkout')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Fazer Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Meu Perfil</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Altura (cm)</Label>
                      <Input
                        value={editedProfile.altura || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, altura: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Idade</Label>
                      <Input
                        value={editedProfile.idade || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, idade: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Altura:</span>
                      <span className="font-medium">{userProfile.altura}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Idade:</span>
                      <span className="font-medium">{userProfile.idade} anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Meta:</span>
                      <span className="font-medium">-{userProfile.meta_kg}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prazo:</span>
                      <span className="font-medium">{userProfile.tempo_metas} semanas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Atividade:</span>
                      <span className="font-medium capitalize">{userProfile.nivel_atividade}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Meu Plano</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 ${
                      user?.plan === 'premium' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : user?.plan === 'standard'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {user?.plan === 'premium' && <Crown className="h-4 w-4 mr-1" />}
                    {user?.plan === 'free' ? 'Gratuito' : user?.plan === 'standard' ? 'Padrão' : 'Premium'}
                  </Badge>
                </div>

                {user?.plan === 'free' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      Faça upgrade para desbloquear recursos premium
                    </p>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      onClick={() => navigate('/checkout')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Fazer Upgrade
                    </Button>
                  </div>
                )}

                {user?.plan !== 'free' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Renovação:</span>
                      <span className="text-sm font-medium">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Ações Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Conversar com ShapeBot
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/onboarding')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Atualizar Perfil
                </Button>
                
                {chatHistory.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={clearChatHistory}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Histórico
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

