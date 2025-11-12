import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TourButtonProps {
  onClick: () => void;
}

const TourButton: React.FC<TourButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
      title="Take a Tour"
    >
      <HelpCircle className="w-4 h-4 mr-2" />
      Take a Tour
    </button>
  );
};

export default TourButton;








