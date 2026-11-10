export type Role = 'customer' | 'admin'

export interface Profile {
  id: string
  full_name: string | null
  role: Role
  created_at?: string
}

export interface LoanProduct {
  id: string
  name: string
  description: string | null
  category: string
  is_active: boolean
}

export interface Journey {
  id: string
  user_id: string
  loan_product_id: string | null
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface JourneyStep {
  id: string
  journey_id: string
  step_key: string
  title: string
  status: 'pending' | 'completed'
  position: number
  completed_at: string | null
}

export interface KnowledgeDocument {
  id: string
  title: string
  content: string
  source: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface ApplicationRecord {
  id: string
  user_id: string
  journey_id: string | null
  demo_status: 'Draft' | 'Submitted' | 'Under Review' | 'Completed' | 'Cancelled'
  created_at: string
}
