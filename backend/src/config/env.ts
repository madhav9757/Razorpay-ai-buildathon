import 'dotenv/config'

const requiredEnv = (name: string): string => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const env = {
  razorpay: {
    keyId: requiredEnv('RAZORPAY_KEY_ID'),
    keySecret: requiredEnv('RAZORPAY_KEY_SECRET'),
    baseUrl:
      process.env.RAZORPAY_BASE_URL ?? 'https://api.razorpay.com/v1',
  },
} as const