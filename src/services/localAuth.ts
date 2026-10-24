import { readStorage, writeStorage } from '../lib/storage'
import type { AuthResult, AuthUser } from '../types/auth'

const USERS_KEY = 'just-eight-local-users'
const SESSION_KEY = 'just-eight-auth-session'

interface StoredUser extends AuthUser {
  passwordHash: string
}

/** Lightweight non-cryptographic hash for local demo auth only. */
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i)
    hash |= 0
  }
  return `local_${hash}`
}

function getUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(USERS_KEY, [])
}

function saveUsers(users: StoredUser[]) {
  writeStorage(USERS_KEY, users)
}

function toPublicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    provider: user.provider,
    /** Local demo mode: signed-in store owners can manage products */
    isAdmin: true,
  }
}

export function getLocalSession(): AuthUser | null {
  return readStorage<AuthUser | null>(SESSION_KEY, null)
}

export function setLocalSession(user: AuthUser | null) {
  writeStorage(SESSION_KEY, user)
}

export function localSignUp(input: {
  fullName: string
  email: string
  password: string
}): AuthResult & { user?: AuthUser } {
  const email = input.email.trim().toLowerCase()
  const fullName = input.fullName.trim()
  const password = input.password

  if (!fullName) return { ok: false, message: 'Full name is required.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' }
  }
  if (password.length < 8) {
    return { ok: false, message: 'Password must be at least 8 characters.' }
  }

  const users = getUsers()
  if (users.some((u) => u.email === email)) {
    return { ok: false, message: 'An account with this email already exists.' }
  }

  const user: StoredUser = {
    id: `local_${Date.now()}`,
    email,
    fullName,
    provider: 'email',
    passwordHash: hashPassword(password),
  }

  saveUsers([...users, user])
  const publicUser = toPublicUser(user)
  setLocalSession(publicUser)
  return {
    ok: true,
    message: 'Account created. You are signed in.',
    user: publicUser,
  }
}

export function localSignIn(input: {
  email: string
  password: string
}): AuthResult & { user?: AuthUser } {
  const email = input.email.trim().toLowerCase()
  const user = getUsers().find((u) => u.email === email)

  if (!user || user.passwordHash !== hashPassword(input.password)) {
    return { ok: false, message: 'Incorrect email or password.' }
  }

  const publicUser = toPublicUser(user)
  setLocalSession(publicUser)
  return { ok: true, message: 'Signed in successfully.', user: publicUser }
}

export function localSignOut() {
  setLocalSession(null)
}
