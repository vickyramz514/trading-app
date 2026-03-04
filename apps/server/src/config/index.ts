import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT ?? '3002', 10),
  broker: {
    apiKey: process.env.BROKER_API_KEY ?? '',
    accessToken: process.env.BROKER_ACCESS_TOKEN ?? '',
    baseUrl: process.env.BROKER_BASE_URL ?? '',
    apiKeyHeader: process.env.BROKER_API_KEY_HEADER ?? 'X-API-KEY',
    paths: {
      profile: process.env.BROKER_PATH_PROFILE ?? '/user/profile',
      holdings: process.env.BROKER_PATH_HOLDINGS ?? '/portfolio/holdings',
      positions: process.env.BROKER_PATH_POSITIONS ?? '/portfolio/positions',
      quote: process.env.BROKER_PATH_QUOTE ?? '/market/quote',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  },
} as const
