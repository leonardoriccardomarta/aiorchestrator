import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Clock, Mail, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

interface EmailStatus {
  id: string;
  templateKey: string;
  status: 'scheduled' | 'sent' | 'failed' | 'pending';
  scheduledTime: string;
  sentTime?: string;
  subject: string;
  error?: string;
}

interface TrialStats {
  messagesProcessed: number;
  responseTime: number;
  customerSatisfaction: number;
  timesSaved: number;
  emailsSent: number;
}

interface TrialEmailMonitorProps {
  trialId: string;
  userEmail: string;
}

const TrialEmailMonitor: React.FC<TrialEmailMonitorProps> = ({ trialId, userEmail }) => {
  const [emailStatuses, setEmailStatuses] = useState<EmailStatus[]>([]);
  const [trialStats, setTrialStats] = useState<TrialStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmailStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/trial/${trialId}/email-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch email status');
      const data = await response.json();
      setEmailStatuses(data.emails || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  }, [trialId]);

  const fetchTrialStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/trial/${trialId}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch trial stats');
      const data = await response.json();
      setTrialStats(data.stats);
      setIsLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
      setIsLoading(false);
    }
  }, [trialId]);

  useEffect(() => {
    fetchEmailStatus();
    fetchTrialStats();
    // Poll every 30 seconds for updates
    const interval = setInterval(() => {
      fetchEmailStatus();
      fetchTrialStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [trialId, fetchEmailStatus, fetchTrialStats]);

  const triggerTestEmail = async () => {
    try {
      const response = await fetch(`/api/trial/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          email: userEmail,
          templateKey: 'day0_welcome',
        }),
      });

      if (!response.ok) throw new Error('Failed to send test email');
      
      // Refresh status
      fetchEmailStatus();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      sent: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      failed: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEmailTitle = (templateKey: string) => {
    const titles = {
      day0_welcome: 'Welcome Email',
      day1_setup_confirmation: 'Setup Confirmation',
      day3_early_results: 'Early Results Check',
      day5_success_review: 'Success Review',
      day6_soft_close: 'Soft Close',
      day7_final_decision: 'Final Decision',
    };
    return titles[templateKey as keyof typeof titles] || templateKey;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading trial data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trial Statistics */}
      {trialStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Trial Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{trialStats.messagesProcessed}</div>
                <div className="text-sm text-gray-600">Messages Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{trialStats.responseTime}ms</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{trialStats.customerSatisfaction}%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{trialStats.timesSaved}h</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Automation Status
          </CardTitle>
          <Button onClick={triggerTestEmail} variant="outline" size="sm">
            Send Test Email
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {emailStatuses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No email automation found for this trial</p>
                <p className="text-sm">Email sequence will start when trial begins</p>
              </div>
            ) : (
              emailStatuses.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{getEmailTitle(email.templateKey)}</h4>
                      {getStatusBadge(email.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{email.subject}</p>
                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                      <span>Scheduled: {new Date(email.scheduledTime).toLocaleString()}</span>
                      {email.sentTime && (
                        <span>Sent: {new Date(email.sentTime).toLocaleString()}</span>
                      )}
                    </div>
                    {email.error && (
                      <p className="text-sm text-red-600 mt-1">Error: {email.error}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialEmailMonitor;