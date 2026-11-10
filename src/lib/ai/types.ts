export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  answer: string
  sources: { id?: string; title: string; source?: string | null }[]
  mode: 'mock' | 'provider'
}

export interface AIProvider {
  generate(input: { question: string; context?: string; history?: AIMessage[] }): Promise<AIResponse>
}
