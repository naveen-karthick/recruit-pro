import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type IconFieldProps = {
  icon: LucideIcon
  placeholder: string
  type?: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  required?: boolean
}

export function IconField({
  icon: Icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required,
}: IconFieldProps) {
  const id = useId()

  return (
    <div className="login-field group relative">
      <Icon
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-neutral-600"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={cn(
          'login-field-input w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-11 pr-4 text-sm text-neutral-900 outline-none',
          'placeholder:text-neutral-400 transition-all duration-200',
          'hover:border-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100',
        )}
      />
    </div>
  )
}
