export interface RazorpayOrder {
  id: string
  entity: 'order'
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string | null
  status: 'created' | 'attempted' | 'paid'
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface RazorpayPayment {
  id: string
  entity: 'payment'
  amount: number
  currency: string
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
  order_id: string | null
  method: string
  captured: boolean
  description: string | null
  email: string | null
  contact: string | null
  error_code: string | null
  error_description: string | null
  created_at: number
}

export interface RazorpayApiResponse<T> {
  entity: string
  count: number
  items: T[]
}