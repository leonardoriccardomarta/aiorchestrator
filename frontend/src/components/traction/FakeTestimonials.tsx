import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  verified: boolean;
  logo?: string;
}

export const FakeTestimonials: React.FC<{ className?: string }> = ({ className }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      role: 'CEO',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'AI Orchestrator increased our customer satisfaction by 85% and reduced response time from 2 hours to 30 seconds. Game changer!',
      rating: 5,
      verified: true,
      logo: 'https://logo.clearbit.com/techstart.com'
    },
    {
      id: '2',
      name: 'Marco Rodriguez',
      company: 'E-commerce Plus',
      role: 'Operations Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'We automated 90% of our customer support. Our team can now focus on strategic initiatives instead of repetitive queries.',
      rating: 5,
      verified: true,
      logo: 'https://logo.clearbit.com/ecommerceplus.com'
    },
    {
      id: '3',
      name: 'Jennifer Chen',
      company: 'Global Retail',
      role: 'Customer Success Director',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The ROI was immediate. We saved $50K in the first month and our customers love the instant responses.',
      rating: 5,
      verified: true,
      logo: 'https://logo.clearbit.com/globalretail.com'
    },
    {
      id: '4',
      name: 'Alex Thompson',
      company: 'SaaS Solutions',
      role: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Integration was seamless. We went from concept to live chatbot in under 2 hours. Incredible platform!',
      rating: 5,
      verified: true,
      logo: 'https://logo.clearbit.com/saassolutions.com'
    },
    {
      id: '5',
      name: 'Emma Wilson',
      company: 'Digital Agency Pro',
      role: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      content: 'Our clients are amazed by the quality of responses. It feels like having a dedicated team member 24/7.',
      rating: 5,
      verified: true,
      logo: 'https://logo.clearbit.com/digitalagencypro.com'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Trusted by 10,000+ Businesses
        </h3>
        <div className="flex items-center justify-center space-x-1">
          {renderStars(5)}
          <span className="ml-2 text-sm text-gray-600">4.9/5 from 2,847 reviews</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTestimonial}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={testimonials[currentTestimonial].avatar}
              alt={testimonials[currentTestimonial].name}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {testimonials[currentTestimonial].verified && (
              <div className="ml-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          <blockquote className="text-gray-700 text-lg mb-4 italic">
            "{testimonials[currentTestimonial].content}"
          </blockquote>

          <div className="flex items-center justify-center space-x-3">
            <div>
              <div className="font-semibold text-gray-900">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-sm text-gray-600">
                {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4">
            {renderStars(testimonials[currentTestimonial].rating)}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex items-center justify-center space-x-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500 mb-3">
          Trusted by leading companies
        </div>
        <div className="flex items-center justify-center space-x-6 opacity-60">
          <div className="text-lg font-bold text-gray-400">SHOPIFY</div>
          <div className="text-lg font-bold text-gray-400">STRIPE</div>
          <div className="text-lg font-bold text-gray-400">NOTION</div>
          <div className="text-lg font-bold text-gray-400">ZAPIER</div>
        </div>
      </div>
    </div>
  );
};

export default FakeTestimonials;
