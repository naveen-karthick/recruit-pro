const SESSION_KEY = 'recruitpro-session'
const USER_KEY = 'recruitpro-user'

export type UserProfile = {
  name: string
  email: string
  initials: string
}

const defaultUser: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex@recruitpro.com',
  initials: 'AR',
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function isAuthenticated() {
  return localStorage.getItem(SESSION_KEY) === '1'
}

export function signIn() {
  localStorage.setItem(SESSION_KEY, '1')
  if (!localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser))
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return defaultUser
    const parsed = JSON.parse(raw) as Partial<UserProfile>
    const name = parsed.name ?? defaultUser.name
    return {
      name,
      email: parsed.email ?? defaultUser.email,
      initials: parsed.initials ?? (initialsFromName(name) || defaultUser.initials),
    }
  } catch {
    return defaultUser
  }
}

export function saveUser(profile: Pick<UserProfile, 'name' | 'email'>) {
  const user: UserProfile = {
    ...profile,
    initials: initialsFromName(profile.name) || defaultUser.initials,
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}
