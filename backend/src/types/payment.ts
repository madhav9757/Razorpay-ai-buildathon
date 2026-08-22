export type PaymentStatus =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed'

export interface Payment {
  paymentId: string
  orderId: string | null

  amount: number
  currency: string

  status: PaymentStatus
  method: string

  captured: boolean

  customer: {
    email: string | null
    contact: string | null
  }

  failure: {
    code: string | null
    reason: string | null
  }

  createdAt: Date
}