import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { LoginPage } from '@/features/auth/LoginPage'
import { CompaniesPage } from '@/features/companies/CompaniesPage'
import { ContactsPage } from '@/features/contacts/ContactsPage'
import { CandidatesPage } from '@/features/candidates/CandidatesPage'
import { JobsPage } from '@/features/jobs/JobsPage'
import { UserSettingsPage } from '@/features/settings/UserSettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/companies" replace />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="settings" element={<UserSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
