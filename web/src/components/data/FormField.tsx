import type { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TextFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: FieldError
  type?: string
  placeholder?: string
}

export function TextField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
}: TextFieldProps<T>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={String(name)}>{label}</Label>
      <Input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  )
}

interface TextAreaFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: FieldError
  placeholder?: string
}

export function TextAreaField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  placeholder,
}: TextAreaFieldProps<T>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={String(name)}>{label}</Label>
      <Textarea id={String(name)} placeholder={placeholder} {...register(name)} />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
