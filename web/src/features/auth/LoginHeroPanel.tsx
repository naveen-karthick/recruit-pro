import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { loginHeroImage } from './login-images'

type LoginHeroPanelProps = {
  className?: string
}

export function LoginHeroPanel({ className }: LoginHeroPanelProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  const handleParallax = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `translate(${x * 10}px, ${y * 8}px)`
  }, [])

  const resetParallax = useCallback(() => {
    const el = heroRef.current
    if (el) el.style.transform = 'translate(0, 0)'
  }, [])

  return (
    <div
      className={cn(
        'login-hero-panel relative hidden overflow-hidden md:block md:w-1/2',
        className,
      )}
      onMouseMove={handleParallax}
      onMouseLeave={resetParallax}
    >
      <div className="login-hero-ken-burns absolute inset-0">
        <div
          ref={heroRef}
          className="login-hero-parallax absolute inset-[-8%] bg-cover"
          style={{
            backgroundImage: `url(${loginHeroImage.src})`,
            backgroundPosition: loginHeroImage.position,
          }}
        />
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/90 text-xs font-bold text-white shadow-lg">
            R
          </span>
          <span className="text-sm font-medium text-white/90 drop-shadow-md">
            RecruitPro Portal
          </span>
        </div>
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/50 drop-shadow-sm transition-colors hover:text-white/80"
        >
          Photo by {loginHeroImage.credit}
        </a>
      </div>
    </div>
  )
}
