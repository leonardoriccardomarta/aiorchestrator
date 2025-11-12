import React from 'react';
import { FileText, Scale, AlertCircle, Users } from 'lucide-react';
import LiveChatWidget from '../components/LiveChatWidget';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Live Chat Widget */}
      <LiveChatWidget />
      
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Please read these terms carefully before using our AI chatbot services.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Last updated: January 2025
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
              <FileText className="w-8 h-8 text-indigo-600 mr-3" />
              Agreement to Terms
            </h2>
            <p className="text-slate-600 mb-4">
              By accessing and using AI Orchestrator's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Service Description</h2>
            <p className="text-slate-600 mb-4">
              AI Orchestrator provides AI-powered chatbot services including:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Intelligent customer service chatbots</li>
              <li>Multi-language support (50+ languages)</li>
              <li>E-commerce integrations (Shopify, WooCommerce)</li>
              <li>Analytics and reporting tools</li>
              <li>API access and webhook integrations</li>
              <li>Custom chatbot training and configuration</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
              <Users className="w-8 h-8 text-indigo-600 mr-3" />
              User Accounts
            </h2>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Account Creation</h3>
            <p className="text-slate-600 mb-4">
              To access our services, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Account Responsibilities</h3>
            <p className="text-slate-600 mb-4">You agree to:</p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Provide accurate and current information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Use the service in compliance with applicable laws</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
              <AlertCircle className="w-8 h-8 text-indigo-600 mr-3" />
              Acceptable Use Policy
            </h2>
            <p className="text-slate-600 mb-4">
              You agree not to use our services for any unlawful or prohibited activities, including:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Violating any applicable laws or regulations</li>
              <li>Transmitting harmful or malicious content</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with the proper functioning of our services</li>
              <li>Using the service for spam or unsolicited communications</li>
              <li>Impersonating others or providing false information</li>
              <li>Collecting user data without proper consent</li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Payment Terms</h2>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Subscription Plans</h3>
            <p className="text-slate-600 mb-4">
              Our services are offered on a subscription basis with the following plans:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li><strong>Starter:</strong> $29/month - 1 chatbot, 5,000 messages/month</li>
              <li><strong>Pro:</strong> $99/month - 2 chatbots, 25,000 messages/month</li>
              <li><strong>Enterprise:</strong> $299/month - 3 chatbots, 100,000 messages/month</li>
            </ul>
            
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Billing and Cancellation</h3>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Subscriptions are billed monthly or annually in advance</li>
              <li>You may cancel your subscription at any time</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial months or unused services</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property</h2>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our Rights</h3>
            <p className="text-slate-600 mb-4">
              AI Orchestrator retains all rights, title, and interest in our services, including all intellectual property rights. Our trademarks, logos, and service marks are protected by law.
            </p>
            
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Your Content</h3>
            <p className="text-slate-600 mb-4">
              You retain ownership of content you provide to our services. By using our services, you grant us a limited license to use your content to provide and improve our services.
            </p>
          </section>

          {/* Privacy and Data */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Privacy and Data Protection</h2>
            <p className="text-slate-600 mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>We implement industry-standard security measures</li>
              <li>We comply with applicable data protection laws</li>
              <li>We do not sell your personal information to third parties</li>
              <li>You have rights regarding your personal data</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Service Availability</h2>
            <p className="text-slate-600 mb-4">
              While we strive to maintain high service availability, we do not guarantee uninterrupted access to our services. We may:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Perform scheduled maintenance</li>
              <li>Update or modify our services</li>
              <li>Suspend services for security or legal reasons</li>
              <li>Experience downtime due to technical issues</li>
            </ul>
            <p className="text-slate-600">
              We provide a 99.9% uptime guarantee for Enterprise customers.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
              <Scale className="w-8 h-8 text-indigo-600 mr-3" />
              Limitation of Liability
            </h2>
            <p className="text-slate-600 mb-4">
              To the maximum extent permitted by law, AI Orchestrator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Business interruption or downtime</li>
              <li>Cost of substitute services</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Our total liability shall not exceed the amount paid by you for the services in the 12 months preceding the claim.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Termination</h2>
            <p className="text-slate-600 mb-4">
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>Your access to the services will be discontinued</li>
              <li>You remain responsible for all charges incurred</li>
              <li>We may delete your data after a reasonable period</li>
              <li>Certain provisions of these Terms will survive termination</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Changes to Terms</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through our service. Your continued use of the services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Governing Law</h2>
            <p className="text-slate-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Information</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-slate-50 p-6 rounded-lg">
              <p className="text-slate-600">
                <strong>Email:</strong> <a href="mailto:aiorchestratoor@gmail.com" className="text-indigo-600 hover:underline">aiorchestratoor@gmail.com</a>
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 AI Orchestrator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
