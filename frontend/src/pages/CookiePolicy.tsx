import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Check } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate('/')} className="flex items-center text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center">
            <Cookie className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
              <p className="text-slate-600 mt-1">Last updated: September 30, 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          
          <section>
            <p className="text-slate-700 leading-relaxed">
              This Cookie Policy explains how AI Orchestrator uses cookies and similar technologies 
              to recognize you when you visit our platform. It explains what these technologies are, 
              why we use them, and your rights to control our use of them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
            <p className="text-slate-700 leading-relaxed">
              Cookies are small data files placed on your device when you visit a website. 
              They help us improve your experience, remember your preferences, and analyze usage patterns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Essential Cookies (Required)
                </h3>
                <p className="text-slate-700 mb-2">
                  These cookies are necessary for the platform to function:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                  <li><code className="bg-slate-100 px-2 py-1 rounded">authToken</code> - Authentication and session management</li>
                  <li><code className="bg-slate-100 px-2 py-1 rounded">userData</code> - User preferences and settings</li>
                  <li><code className="bg-slate-100 px-2 py-1 rounded">planInfo</code> - Subscription plan details</li>
                </ul>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Analytics Cookies (Optional)
                </h3>
                <p className="text-slate-700 mb-2">
                  Help us understand how users interact with our platform:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                  <li>Page views and navigation patterns</li>
                  <li>Feature usage statistics</li>
                  <li>Performance metrics</li>
                  <li>Error tracking (anonymized)</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Functional Cookies (Optional)
                </h3>
                <p className="text-slate-700 mb-2">
                  Enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                  <li>Language preferences</li>
                  <li>Theme settings (light/dark mode)</li>
                  <li>Dashboard customization</li>
                  <li>Recent activity tracking</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use cookies from trusted third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
              <li><strong>Analytics:</strong> Usage patterns and performance monitoring (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Cookie Choices</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You can control cookies through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete existing ones</li>
              <li><strong>Account Settings:</strong> Manage optional cookies in your dashboard settings</li>
              <li><strong>Opt-Out:</strong> Disable analytics cookies without affecting functionality</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-slate-700">
                <strong>Note:</strong> Disabling essential cookies may prevent you from using certain 
                features of our platform, including login and chatbot management.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookie Duration</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for specified period (7-30 days typically)</li>
              <li><strong>Authentication:</strong> 7 days (or until logout)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Updates to Cookie Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Cookie Policy. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700">
              Questions about cookies? Email us at:{' '}
              <a href="mailto:privacy@aiorchestrator.com" className="text-indigo-600 hover:underline">
                privacy@aiorchestrator.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-8 text-center text-slate-600">
          <p>© 2025 AI Orchestrator. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;































