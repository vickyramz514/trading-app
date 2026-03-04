let kiteAccessToken: string | null = null
let kiteUserData: Record<string, unknown> | null = null

export function getKiteToken(): string | null {
  return kiteAccessToken
}

export function setKiteToken(token: string, userData?: Record<string, unknown>): void {
  kiteAccessToken = token
  kiteUserData = userData ?? null
}

export function clearKiteToken(): void {
  kiteAccessToken = null
  kiteUserData = null
}

export function getKiteUserData(): Record<string, unknown> | null {
  return kiteUserData
}
