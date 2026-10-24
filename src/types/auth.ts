export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  provider: 'email' | 'google'
  isAdmin?: boolean
}

export interface AuthResult {
  ok: boolean
  message: string
}
