import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialProofBannerProps {
  className?: string;
}

export const SocialProofBanner: React.FC<SocialProofBannerProps> = ({ className }) => {
  const [currentUser, setCurrentUser] = useState<{ name: string; action: string; time: string } | null>(null);
  const [userCount, setUserCount] = useState(1247);

  // Simulate real-time user activity
  useEffect(() => {
    const users = [
      { name: 'Sarah M.', action: 'just created an AI chatbot', time: '2 minutes ago' },
      { name: 'Marco R.', action: 'upgraded to Professional plan', time: '5 minutes ago' },
      { name: 'Jennifer L.', action: 'saved €299 with yearly billing', time: '8 minutes ago' },
      { name: 'Alex K.', action: 'integrated WhatsApp chatbot', time: '12 minutes ago' },
      { name: 'Emma T.', action: 'achieved 95% satisfaction rate', time: '15 minutes ago' },
      { name: 'David P.', action: 'automated 500+ customer queries', time: '18 minutes ago' },
      { name: 'Lisa W.', action: 'generated €2,340 in sales', time: '22 minutes ago' },
      { name: 'Tom H.', action: 'completed onboarding in 3 minutes', time: '25 minutes ago' },
    ];

    const showRandomUser = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setCurrentUser(randomUser);
      
      // Update user count with realistic growth
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    };

    // Show first user immediately
    showRandomUser();

    // Update every 3-8 seconds
    const interval = setInterval(showRandomUser, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4 text-sm">
        {/* Live indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-medium">Live</span>
        </div>

        {/* User count */}
        <div className="flex items-center space-x-1">
          <span className="font-bold text-lg">{userCount.toLocaleString()}</span>
          <span>users active today</span>
        </div>

        <div className="hidden md:block text-slate-200">•</div>

        {/* Recent activity */}
        <AnimatePresence mode="wait">
          {currentUser && (
            <motion.div
              key={currentUser.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-2"
            >
              <span className="font-medium">{currentUser.name}</span>
              <span>{currentUser.action}</span>
              <span className="text-slate-200">{currentUser.time}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Urgency indicator */}
        <div className="hidden lg:flex items-center space-x-2 ml-4">
          <span className="text-yellow-300">⚡</span>
          <span className="text-xs">Limited time: 50% off first month</span>
        </div>
      </div>
    </div>
  );
};

export default SocialProofBanner;
