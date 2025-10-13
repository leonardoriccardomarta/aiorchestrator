import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TourButtonProps {
  onClick: () => void;
}

const TourButton: React.FC<TourButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
      title="Take a Tour"
    >
      <HelpCircle className="w-4 h-4 mr-2" />
      Take a Tour
    </button>
  );
};

export default TourButton;








