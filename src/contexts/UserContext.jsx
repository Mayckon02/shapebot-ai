import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext({})

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [dailyMessageCount, setDailyMessageCount] = useState(0)

  useEffect(() => {
    // Carregar dados salvos
    const savedProfile = localStorage.getItem('shapebot_onboarding')
    const savedHistory = localStorage.getItem('shapebot_chat_history')
    const savedMessageCount = localStorage.getItem('shapebot_daily_messages')
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
    
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    }

    if (savedMessageCount) {
      const data = JSON.parse(savedMessageCount)
      const today = new Date().toDateString()
      if (data.date === today) {
        setDailyMessageCount(data.count)
      } else {
        // Reset contador se for um novo dia
        setDailyMessageCount(0)
        localStorage.setItem('shapebot_daily_messages', JSON.stringify({
          date: today,
          count: 0
        }))
      }
    }
  }, [])

  const saveUserProfile = (profile) => {
    setUserProfile(profile)
    localStorage.setItem('shapebot_onboarding', JSON.stringify(profile))
  }

  const addMessage = (message) => {
    const newHistory = [...chatHistory, message]
    setChatHistory(newHistory)
    localStorage.setItem('shapebot_chat_history', JSON.stringify(newHistory))
    
    // Incrementar contador de mensagens diárias
    const newCount = dailyMessageCount + 1
    setDailyMessageCount(newCount)
    const today = new Date().toDateString()
    localStorage.setItem('shapebot_daily_messages', JSON.stringify({
      date: today,
      count: newCount
    }))
  }

  const clearChatHistory = () => {
    setChatHistory([])
    localStorage.removeItem('shapebot_chat_history')
  }

  const canSendMessage = (userPlan) => {
    if (userPlan === 'premium' || userPlan === 'standard') {
      return true
    }
    return dailyMessageCount < 5 // Limite de 5 mensagens para plano gratuito
  }

  const generateShapeBotPrompt = () => {
    if (!userProfile) return ''
    
    return `Você é o ShapeBot AI, um assistente virtual especialista em emagrecimento. Seu papel é agir como coach, nutricionista e personal trainer, criando planos 100% personalizados com base nas respostas do usuário.

Seu estilo é motivador, direto, leve e encorajador. Use sempre uma linguagem simples, acessível e otimista. Não use linguagem técnica complicada. Trate o usuário como um amigo que quer ajuda real.

Você deve acompanhar o usuário em 3 etapas:

🔹 ETAPA 1 – PLANO ALIMENTAR
Com base nas informações abaixo, elabore um plano alimentar diário personalizado para ajudar a pessoa a perder peso. Pergunte antes o que ela costuma comer no café, almoço, jantar e lanches. Depois disso, monte o plano ideal com substituições saudáveis e sugestões práticas de alimentação acessível e fácil de seguir.

🔹 ETAPA 2 – MOTIVAÇÃO E APOIO
Envie frases motivacionais e lembre o usuário dos objetivos dele de forma positiva. Elogie os avanços, mesmo que pequenos. Ajude a manter o foco.

🔹 ETAPA 3 – TREINOS PERSONALIZADOS
Crie uma sugestão de treino simples com base no tempo que a pessoa tem por dia, no nível atual de atividade física e no objetivo de emagrecimento. Dê opções com e sem academia, e sempre explique de forma fácil como executar cada exercício.

🔹 DADOS DO USUÁRIO:
- Peso atual: ${userProfile.peso} kg
- Altura: ${userProfile.altura} cm
- Idade: ${userProfile.idade} anos
- Quanto quer emagrecer: ${userProfile.meta_kg} kg
- Tempo disponível: ${userProfile.tempo_metas} semanas
- Alimentação atual: ${userProfile.alimentacao}
- Nível de atividade física: ${userProfile.nivel_atividade}
- Tem acesso à academia?: ${userProfile.tem_academia ? 'Sim' : 'Não'}
- Tempo disponível por dia: ${userProfile.tempo_treino} minutos

Sempre espere o usuário responder entre uma etapa e outra. Nunca pule direto para o plano sem perguntar o que ele come ou se tem restrições alimentares.

Seja positivo, atencioso e acompanhe o progresso da pessoa ao longo do tempo.`
  }

  const value = {
    userProfile,
    chatHistory,
    dailyMessageCount,
    saveUserProfile,
    addMessage,
    clearChatHistory,
    canSendMessage,
    generateShapeBotPrompt
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider')
  }
  return context
}

