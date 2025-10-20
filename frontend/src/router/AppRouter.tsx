import { Routes, Route, Outlet } from 'react-router-dom';
import { FC, lazy, Suspense } from 'react';

import Layout from '../components/layout/Layout';
import { PageLoading } from '../components/ui/Loading';
import ErrorBoundary from '../components/ErrorBoundary';

// Import pages directly to avoid lazy loading issues
import DashboardPage from '../pages/Dashboard';
import Chatbot from '../pages/Chatbot';
import AnalyticsPage from '../pages/Analytics';
import ConnectionsPage from '../pages/Connections';
import SettingsPage from '../pages/Settings';
import PricingPage from '../pages/Pricing';
import LandingPage from '../pages/LandingPageOptimized';
import OnboardingPage from '../pages/Onboarding';
import EmailVerificationPage from '../pages/EmailVerification';
import NotFoundPage from '../pages/NotFound';

// Footer pages
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import Contact from '../pages/Contact';
import Blog from '../pages/Blog';
import AffiliateProgram from '../pages/AffiliateProgram';

// Chatbot components
const TestChatbotWizard = lazy(() => import('../components/chatbot/TestChatbotWizard'));

import { withAuthProtection, withBasicAuthProtection } from '../middleware/authMiddleware';

// Create protected components
const ProtectedDashboard = withAuthProtection(DashboardPage);
const ProtectedChatbot = withAuthProtection(Chatbot);
const ProtectedAnalytics = withAuthProtection(AnalyticsPage);
const ProtectedConnections = withAuthProtection(ConnectionsPage);
const ProtectedSettings = withBasicAuthProtection(SettingsPage);
const ProtectedPricing = withAuthProtection(PricingPage);

const AppRouter: FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Footer Pages (Public) */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/affiliates" element={<AffiliateProgram />} />
        
        {/* Onboarding (Protected) */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        {/* Email Verification (Public) */}
        <Route path="/verify" element={<EmailVerificationPage />} />
        
        <Route path="/chatbot/new" element={<TestChatbotWizard />} />

        {/* Protected Layout with nested routes */}
        <Route element={<Layout children={<Outlet />} />}>
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/chatbot" element={<ProtectedChatbot />} />
          <Route path="/analytics" element={<ProtectedAnalytics />} />
          <Route path="/connections" element={<ProtectedConnections />} />
          <Route path="/settings" element={<ProtectedSettings />} />
          <Route path="/pricing" element={<ProtectedPricing />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRouter;