import React from 'react';
import { ArrowRight, Users, Target, Zap, Shield } from 'lucide-react';
import LiveChatWidget from '../components/LiveChatWidget';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Live Chat Widget */}
      <LiveChatWidget />
      
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About AI Orchestrator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing customer service with intelligent AI chatbots that understand, respond, and engage in over 50 languages.
          </p>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To democratize AI-powered customer service by making intelligent chatbots accessible to businesses of all sizes, in every language, anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Constantly pushing the boundaries of AI technology to deliver cutting-edge solutions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">
                Building secure, reliable AI systems that businesses can depend on.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Making advanced AI accessible to businesses regardless of their size or technical expertise.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Results</h3>
              <p className="text-gray-600">
                Focused on delivering measurable improvements in customer satisfaction and business growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2024, AI Orchestrator was born from a simple observation: most businesses struggle to provide consistent, multilingual customer support around the clock.
                </p>
                <p>
                  We saw an opportunity to bridge the gap between advanced AI technology and practical business needs. Our team of AI experts, engineers, and business strategists came together with a shared vision.
                </p>
                <p>
                  Today, we're proud to serve thousands of businesses worldwide, helping them increase customer satisfaction by 40% on average while reducing support costs by 60%.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Milestones</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">2024 Q1</h4>
                    <p className="text-gray-600">Company founded with core AI technology</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">2024 Q2</h4>
                    <p className="text-gray-600">First 100 customers onboarded</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">2024 Q3</h4>
                    <p className="text-gray-600">Multi-language support launched</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">2024 Q4</h4>
                    <p className="text-gray-600">10,000+ businesses served worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse team of AI researchers, engineers, and business experts passionate about transforming customer service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">AI</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Research Team</h3>
              <p className="text-gray-600">
                Leading experts in natural language processing and machine learning, constantly advancing our AI capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">ENG</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Engineering Team</h3>
              <p className="text-gray-600">
                World-class developers building scalable, secure, and reliable AI infrastructure for businesses worldwide.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">BIZ</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Team</h3>
              <p className="text-gray-600">
                Strategic thinkers and customer success experts ensuring every business gets the most from our AI solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 AI Orchestrator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;




