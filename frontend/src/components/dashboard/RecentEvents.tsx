import React from 'react';

interface Event {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface RecentEventsProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const EventIcon = ({ type }: { type: Event['type'] }) => {
  switch (type) {
    case 'chatbot_created':
      return (
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          
        </div>
      );
    case 'workflow_executed':
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          ⚡
        </div>
      );
    case 'error':
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          
        </div>
      );
    case 'warning':
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
          
        </div>
      );
    default:
      return null;
  }
};

const RecentEvents: React.FC<RecentEventsProps> = ({ events, onEventClick }) => {
  // Ensure events is an array
  const eventsArray = Array.isArray(events) ? events : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Events</h2>
      <div className="space-y-4">
        {eventsArray.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick?.(event)}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
          >
            <EventIcon type={event.type} />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-900 truncate">{event.title}</h3>
              <p className="text-sm text-slate-500 truncate">{event.description}</p>
              <p className="text-xs text-slate-400 mt-1">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentEvents; 
