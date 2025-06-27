import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowRight, ArrowLeft, Target, Scale, Clock, Utensils, Dumbbell, MapPin } from 'lucide-react'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { saveUserProfile } = useUser()
  
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6
  
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    idade: '',
    meta_kg: '',
    tempo_metas: '',
    alimentacao: '',
    nivel_atividade: '',
    tem_academia: null,
    tempo_treino: '',
    restricoes: '',
    objetivo_principal: ''
  })

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Salvar dados e ir para o chat
      saveUserProfile(formData)
      navigate('/chat')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.peso && formData.altura && formData.idade
      case 2:
        return formData.meta_kg && formData.tempo_metas
      case 3:
        return formData.alimentacao
      case 4:
        return formData.nivel_atividade
      case 5:
        return formData.tem_academia !== null && formData.tempo_treino
      case 6:
        return formData.objetivo_principal
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Vamos conhecer você!</h2>
              <p className="text-gray-600">Preciso de algumas informações básicas para personalizar seu plano.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="peso">Peso atual (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  placeholder="Ex: 75"
                  value={formData.peso}
                  onChange={(e) => updateFormData('peso', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="Ex: 170"
                  value={formData.altura}
                  onChange={(e) => updateFormData('altura', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                placeholder="Ex: 30"
                value={formData.idade}
                onChange={(e) => updateFormData('idade', e.target.value)}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Qual é sua meta?</h2>
              <p className="text-gray-600">Vamos definir um objetivo realista e alcançável.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_kg">Quantos quilos você quer emagrecer?</Label>
                <Input
                  id="meta_kg"
                  type="number"
                  placeholder="Ex: 10"
                  value={formData.meta_kg}
                  onChange={(e) => updateFormData('meta_kg', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempo_metas">Em quantas semanas?</Label>
                <Select value={formData.tempo_metas} onValueChange={(value) => updateFormData('tempo_metas', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 semanas</SelectItem>
                    <SelectItem value="8">8 semanas</SelectItem>
                    <SelectItem value="12">12 semanas</SelectItem>
                    <SelectItem value="16">16 semanas</SelectItem>
                    <SelectItem value="24">24 semanas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Utensils className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Como é sua alimentação?</h2>
              <p className="text-gray-600">Conte sobre seus hábitos alimentares atuais.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alimentacao">Descreva o que você costuma comer no dia a dia</Label>
                <Textarea
                  id="alimentacao"
                  placeholder="Ex: No café da manhã tomo café com pão, no almoço como arroz, feijão e carne, no jantar..."
                  rows={4}
                  value={formData.alimentacao}
                  onChange={(e) => updateFormData('alimentacao', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restricoes">Tem alguma restrição alimentar ou alergia?</Label>
                <Input
                  id="restricoes"
                  placeholder="Ex: Intolerância à lactose, vegetariano, etc."
                  value={formData.restricoes}
                  onChange={(e) => updateFormData('restricoes', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Dumbbell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Qual seu nível de atividade?</h2>
              <p className="text-gray-600">Isso me ajuda a criar treinos adequados para você.</p>
            </div>

            <RadioGroup 
              value={formData.nivel_atividade} 
              onValueChange={(value) => updateFormData('nivel_atividade', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="sedentario" id="sedentario" />
                <Label htmlFor="sedentario" className="flex-1 cursor-pointer">
                  <div className="font-medium">Sedentário</div>
                  <div className="text-sm text-gray-600">Não pratico exercícios regularmente</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="leve" id="leve" />
                <Label htmlFor="leve" className="flex-1 cursor-pointer">
                  <div className="font-medium">Atividade Leve</div>
                  <div className="text-sm text-gray-600">Exercito-me 1-2 vezes por semana</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="moderado" id="moderado" />
                <Label htmlFor="moderado" className="flex-1 cursor-pointer">
                  <div className="font-medium">Atividade Moderada</div>
                  <div className="text-sm text-gray-600">Exercito-me 3-4 vezes por semana</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="intenso" id="intenso" />
                <Label htmlFor="intenso" className="flex-1 cursor-pointer">
                  <div className="font-medium">Atividade Intensa</div>
                  <div className="text-sm text-gray-600">Exercito-me 5+ vezes por semana</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Onde você treina?</h2>
              <p className="text-gray-600">Vou adaptar os exercícios ao seu ambiente.</p>
            </div>

            <div className="space-y-4">
              <RadioGroup 
                value={formData.tem_academia?.toString()} 
                onValueChange={(value) => updateFormData('tem_academia', value === 'true')}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="true" id="tem-academia" />
                  <Label htmlFor="tem-academia" className="flex-1 cursor-pointer">
                    <div className="font-medium">Tenho acesso à academia</div>
                    <div className="text-sm text-gray-600">Posso usar equipamentos de musculação</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="false" id="sem-academia" />
                  <Label htmlFor="sem-academia" className="flex-1 cursor-pointer">
                    <div className="font-medium">Treino em casa</div>
                    <div className="text-sm text-gray-600">Prefiro exercícios que posso fazer em casa</div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="tempo_treino">Quanto tempo você tem disponível por dia para exercícios?</Label>
                <Select value={formData.tempo_treino} onValueChange={(value) => updateFormData('tempo_treino', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tempo disponível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Qual seu principal objetivo?</h2>
              <p className="text-gray-600">Isso me ajuda a focar no que é mais importante para você.</p>
            </div>

            <RadioGroup 
              value={formData.objetivo_principal} 
              onValueChange={(value) => updateFormData('objetivo_principal', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="perder_peso" id="perder_peso" />
                <Label htmlFor="perder_peso" className="flex-1 cursor-pointer">
                  <div className="font-medium">Perder peso rapidamente</div>
                  <div className="text-sm text-gray-600">Foco em emagrecimento acelerado</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="habitos_saudaveis" id="habitos_saudaveis" />
                <Label htmlFor="habitos_saudaveis" className="flex-1 cursor-pointer">
                  <div className="font-medium">Criar hábitos saudáveis</div>
                  <div className="text-sm text-gray-600">Mudança de estilo de vida sustentável</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="tonificar" id="tonificar" />
                <Label htmlFor="tonificar" className="flex-1 cursor-pointer">
                  <div className="font-medium">Tonificar o corpo</div>
                  <div className="text-sm text-gray-600">Ganhar massa magra e definição</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="saude" id="saude" />
                <Label htmlFor="saude" className="flex-1 cursor-pointer">
                  <div className="font-medium">Melhorar a saúde</div>
                  <div className="text-sm text-gray-600">Reduzir riscos e aumentar disposição</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      default:
        return null
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ShapeBot AI</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vamos personalizar seu plano!
          </h1>
          <p className="text-gray-600">
            Olá {user.name}! Preciso conhecer você melhor para criar o plano perfeito.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Etapa {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% completo</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Anterior</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 flex items-center space-x-2"
          >
            <span>{currentStep === totalSteps ? 'Finalizar' : 'Próximo'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Todas as informações são privadas e usadas apenas para personalizar seu plano.
        </div>
      </div>
    </div>
  )
}

