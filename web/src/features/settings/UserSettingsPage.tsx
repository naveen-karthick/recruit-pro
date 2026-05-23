import { useState } from 'react'
import { Bell, Shield, User } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { FeaturePlaceholderPanel } from '@/components/data/FeaturePlaceholderPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUser, saveUser } from '@/lib/auth'

export function UserSettingsPage() {
  const stored = getUser()
  const [name, setName] = useState(stored.name)
  const [email, setEmail] = useState(stored.email)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveUser({ name: name.trim(), email: email.trim() })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <TopBar searchPlaceholder="Search settings..." />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            User settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile and account preferences.
          </p>
        </div>

        <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleSave}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-foreground text-sm font-medium text-background">
                {getUser().initials}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Profile</h3>
                <p className="text-xs text-muted-foreground">
                  Your name and email across RecruitPro
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Full name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit">Save changes</Button>
              {saved && (
                <span className="text-sm text-muted-foreground">Saved</span>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <FeaturePlaceholderPanel
              title="Notifications"
              description="Email alerts for new candidates, job updates, and team mentions."
              icon={Bell}
              items={['Candidate applications', 'Job status changes', 'Weekly digest']}
            />
            <FeaturePlaceholderPanel
              title="Security"
              description="Password, two-factor authentication, and active sessions."
              icon={Shield}
              items={['Change password', 'Two-factor auth', 'Active sessions']}
            />
            <FeaturePlaceholderPanel
              title="Preferences"
              description="Timezone, language, and default dashboard view."
              icon={User}
              items={['Timezone', 'Language', 'Default landing page']}
            />
          </div>
        </div>
      </div>
    </>
  )
}
