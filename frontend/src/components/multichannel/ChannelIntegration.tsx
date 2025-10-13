import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Channel {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'messenger' | 'telegram' | 'instagram';
  status: 'active' | 'inactive' | 'pending';
  lastSync: Date;
  unreadCount: number;
}

interface ChannelStats {
  totalMessages: number;
  responseRate: number;
  averageResponseTime: number;
}

const ChannelIcon: React.FC<{ type: Channel['type'] }> = ({ type }) => {
  const iconMap = {
    email: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    whatsapp: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
      </svg>
    ),
    messenger: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.486 2 2 6.262 2 11.5c0 2.545 1.088 4.988 3 6.772v4.228l4.833-2.416C10.5 20.188 11.25 20 12 20c5.514 0 10-4.262 10-9.5S17.514 2 12 2zm0 18c-.71 0-1.41-.098-2.085-.284l-2.415 1.207v-2.053C5.145 17.29 4 14.545 4 11.5 4 7.364 7.589 4 12 4s8 3.364 8 7.5-3.589 7.5-8 7.5z"/>
      </svg>
    ),
    telegram: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.48.96-.73 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.36-1.77 4.85-1.78.11 0 .35.03.5.16.13.13.17.31.19.47-.02.06-.02.12-.03.19z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7.082c1.602 0 1.792.006 2.425.035 1.627.074 2.385.845 2.46 2.459.028.633.034.822.034 2.424s-.006 1.792-.034 2.424c-.075 1.613-.832 2.386-2.46 2.46-.633.028-.822.035-2.425.035-1.602 0-1.792-.006-2.424-.035-1.63-.075-2.385-.849-2.46-2.46-.028-.632-.035-.822-.035-2.424s.007-1.792.035-2.424c.074-1.615.832-2.386 2.46-2.46.632-.029.822-.034 2.424-.034zm0-1.082c-1.63 0-1.833.007-2.474.037-2.18.1-3.39 1.309-3.49 3.489-.029.641-.036.845-.036 2.474 0 1.63.007 1.834.036 2.474.1 2.179 1.31 3.39 3.49 3.49.641.029.844.036 2.474.036 1.63 0 1.834-.007 2.475-.036 2.176-.1 3.391-1.309 3.489-3.49.029-.64.036-.844.036-2.474 0-1.629-.007-1.833-.036-2.474-.098-2.177-1.309-3.39-3.489-3.489-.641-.03-.845-.037-2.475-.037zm0 2.919c-1.701 0-3.081 1.379-3.081 3.081s1.38 3.081 3.081 3.081 3.081-1.379 3.081-3.081c0-1.701-1.38-3.081-3.081-3.081zm0 5.081c-1.105 0-2-.895-2-2 0-1.104.895-2 2-2 1.104 0 2.001.895 2.001 2s-.897 2-2.001 2zm3.202-5.922c-.397 0-.72.322-.72.72 0 .397.322.72.72.72.398 0 .721-.322.721-.72 0-.398-.322-.72-.721-.72z"/>
      </svg>
    ),
  };

  return (
    <div className={`text-gray-600 ${type === 'whatsapp' ? 'text-green-600' : ''}`}>
      {iconMap[type]}
    </div>
  );
};

const ChannelIntegration: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/multichannel/channels');
        const data = await response.json();
        setChannels(data.channels);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching channels:', error);
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchChannelStats = async () => {
      if (!selectedChannel) return;

      try {
        const response = await fetch(`/api/multichannel/stats/${selectedChannel.id}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching channel stats:', error);
      }
    };

    fetchChannelStats();
  }, [selectedChannel]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <motion.div
            key={channel.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedChannel(channel)}
            className={`card cursor-pointer transition-colors ${
              selectedChannel?.id === channel.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <ChannelIcon type={channel.type} />
                <div>
                  <h3 className="font-medium text-gray-900">{channel.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{channel.type}</p>
                </div>
              </div>
              <span className={`status-badge ${
                channel.status === 'active' ? 'status-active' :
                channel.status === 'inactive' ? 'status-inactive' :
                'status-warning'
              }`}>
                {channel.status}
              </span>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Last sync: {new Date(channel.lastSync).toLocaleDateString()}
              </span>
              {channel.unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {channel.unreadCount} unread
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedChannel && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mt-6"
        >
          <h3 className="text-lg font-semibold mb-4">Channel Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card">
              <span className="stat-label">Total Messages</span>
              <span className="stat-value">{stats.totalMessages.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Response Rate</span>
              <span className="stat-value">{stats.responseRate}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Avg. Response Time</span>
              <span className="stat-value">{stats.averageResponseTime} min</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChannelIntegration; 