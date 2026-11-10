import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { CustomerLayout } from '@/components/layout/CustomerLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import LandingPage from '@/pages/public/LandingPage'
import AboutPage from '@/pages/public/AboutPage'
import HowItWorksPage from '@/pages/public/HowItWorksPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import PrivacyPolicyPage from '@/pages/public/PrivacyPolicyPage'
import TermsPage from '@/pages/public/TermsPage'
import CustomerDashboard from '@/pages/customer/CustomerDashboard'
import AIAssistantPage from '@/pages/customer/AIAssistantPage'
import LoanExplorerPage from '@/pages/customer/LoanExplorerPage'
import LoanJourneyPage from '@/pages/customer/LoanJourneyPage'
import EmiEducationPage from '@/pages/customer/EmiEducationPage'
import DocumentGuidePage from '@/pages/customer/DocumentGuidePage'
import ApplicationTrackerPage from '@/pages/customer/ApplicationTrackerPage'
import MyActivityPage from '@/pages/customer/MyActivityPage'
import ProfilePage from '@/pages/customer/ProfilePage'
import HelpCenterPage from '@/pages/customer/HelpCenterPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UserManagementPage from '@/pages/admin/UserManagementPage'
import JourneyManagementPage from '@/pages/admin/JourneyManagementPage'
import KnowledgeManagementPage from '@/pages/admin/KnowledgeManagementPage'
import ConversationMonitoringPage from '@/pages/admin/ConversationMonitoringPage'
import AIAnalyticsPage from '@/pages/admin/AIAnalyticsPage'
import AuditLogsPage from '@/pages/admin/AuditLogsPage'
import SettingsPage from '@/pages/admin/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<CustomerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="assistant" element={<AIAssistantPage />} />
          <Route path="loans" element={<LoanExplorerPage />} />
          <Route path="journey" element={<LoanJourneyPage />} />
          <Route path="emi" element={<EmiEducationPage />} />
          <Route path="documents" element={<DocumentGuidePage />} />
          <Route path="tracker" element={<ApplicationTrackerPage />} />
          <Route path="activity" element={<MyActivityPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="help" element={<HelpCenterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="journeys" element={<JourneyManagementPage />} />
          <Route path="knowledge" element={<KnowledgeManagementPage />} />
          <Route path="conversations" element={<ConversationMonitoringPage />} />
          <Route path="analytics" element={<AIAnalyticsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
