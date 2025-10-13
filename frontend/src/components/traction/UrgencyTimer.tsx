import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UrgencyTimerProps {
  className?: string;
  variant?: 'banner' | 'modal' | 'inline';
  onExpire?: () => void;
}

export const UrgencyTimer: React.FC<UrgencyTimerProps> = ({ 
  className, 
  variant = 'banner',
  onExpire 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer expired
          clearInterval(timer);
          onExpire?.();
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  if (variant === 'banner') {
    return (
      <div className={`bg-red-600 text-white py-2 px-4 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4 text-sm">
          <span className="font-medium"> Limited Time Offer Ends In:</span>
          <div className="flex items-center space-x-2 font-bold">
            <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
              {formatTime(timeLeft.hours)}
            </div>
            <span>:</span>
            <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
              {formatTime(timeLeft.minutes)}
            </div>
            <span>:</span>
            <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
              {formatTime(timeLeft.seconds)}
            </div>
          </div>
          <span className="text-yellow-300">Save 50% on your first month!</span>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-white rounded-xl shadow-2xl p-8 max-w-md mx-auto ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏰</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Special Offer Expires Soon!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Join thousands of businesses already using AI Orchestrator
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-2xl font-bold text-red-600">
              <div className="text-center">
                <div className="bg-white px-3 py-2 rounded shadow">
                  {formatTime(timeLeft.hours)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Hours</div>
              </div>
              <div className="text-red-400">:</div>
              <div className="text-center">
                <div className="bg-white px-3 py-2 rounded shadow">
                  {formatTime(timeLeft.minutes)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Minutes</div>
              </div>
              <div className="text-red-400">:</div>
              <div className="text-center">
                <div className="bg-white px-3 py-2 rounded shadow">
                  {formatTime(timeLeft.seconds)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Seconds</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Claim 50% Discount Now
            </button>
            <button className="w-full text-gray-500 hover:text-gray-700 transition-colors">
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-red-600">⏰</span>
      <span className="text-sm text-gray-600">Offer ends in:</span>
      <div className="flex items-center space-x-1 font-mono text-sm">
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
};

export default UrgencyTimer;
