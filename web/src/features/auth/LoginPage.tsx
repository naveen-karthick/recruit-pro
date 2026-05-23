import { useState } from 'react'
import { Lock, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '@/lib/auth'
import { GoogleIcon } from './GoogleIcon'
import { IconField } from './IconField'
import { LoginHeroPanel } from './LoginHeroPanel'
import './login.css'

type AuthMode = 'signin' | 'signup'

export function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signIn()
    navigate('/companies')
  }

  const isSignIn = mode === 'signin'

  return (
    <div className="flex min-h-screen w-full">
      {/* Form panel — left */}
      <div className="login-form-panel flex w-full flex-col justify-center bg-white px-8 py-12 sm:px-12 md:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          <header className="login-header mb-10 text-center">
            <p className="text-sm font-normal text-neutral-500">
              {isSignIn ? 'Log in to' : 'Sign up for'}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-950">
              RecruitPro
            </h1>
          </header>

          <div className="login-actions space-y-4">
            <button
              type="button"
              className="login-btn-google flex w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 py-3.5 text-sm font-medium text-white"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              Login with Google
            </button>

            <div className="relative flex items-center py-1">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="px-4 text-xs text-neutral-400">or</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <form
              key={mode}
              onSubmit={handleSubmit}
              className="login-form-fields space-y-3"
            >
              {!isSignIn && (
                <IconField
                  icon={User}
                  placeholder="Your name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                  required
                />
              )}
              <IconField
                icon={Mail}
                placeholder="Your Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                required
              />
              <IconField
                icon={Lock}
                placeholder="Your Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
                required
              />

              <button
                type="submit"
                className="login-btn-primary mt-2 w-full rounded-xl bg-neutral-100 py-3.5 text-sm font-semibold text-neutral-950"
              >
                {isSignIn ? 'Log in' : 'Sign up'}
              </button>
            </form>
          </div>

          <footer className="login-footer mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500">
            {isSignIn ? (
              <>
                <button
                  type="button"
                  className="transition-colors hover:text-neutral-800"
                >
                  Forgot password?
                </button>
                <span className="text-neutral-300">·</span>
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-semibold text-neutral-950 transition-colors hover:text-neutral-600"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-neutral-950 transition-colors hover:text-neutral-600"
                >
                  Log in
                </button>
              </p>
            )}
          </footer>
        </div>
      </div>

      <LoginHeroPanel />
    </div>
  )
}
