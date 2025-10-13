import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  Card,
  Title,
  Text,
  Grid,
  Metric,
  AreaChart,
  DonutChart,
  BarChart,
  Legend,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@tremor/react';

// Define types for chart data
interface ChannelDistribution {
  name: string;
  value: number;
}
interface ResolutionRate {
  category: string;
  value: number;
}
interface RecentEvent {
  eventName?: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, isLoading, error } = useAnalytics();

  if (error) {
    return (
      <Card>
        <Text>Error loading analytics data: {error}</Text>
      </Card>
    );
  }

  if (isLoading || !analyticsData) {
    return <Text>Loading...</Text>;
  }

  // Fallbacks for metrics
  const userEngagement = analyticsData.totalConversations || 0;
  const conversationQuality = analyticsData.overallSatisfaction || 0;
  const botPerformance = analyticsData.averageResponseTime || 0;

  // Fallbacks for charts
  const conversationTrends = analyticsData.weeklyData || [];
  const byChannel = analyticsData.channelDistribution || [];
  const sessionDuration = analyticsData.sentimentAnalysis || [];
  const responseTime = analyticsData.sentimentAnalysis || [];
  const resolutionRate = analyticsData.topIssues || [];
  const recentEvents = analyticsData.chatbots || [];

  return (
    <div className="space-y-6">
      <Title>Analytics Dashboard</Title>

      {/* Key Metrics */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card>
          <Text>User Engagement</Text>
          <Metric>{userEngagement}</Metric>
        </Card>
        <Card>
          <Text>Conversation Quality</Text>
          <Metric>{conversationQuality}</Metric>
        </Card>
        <Card>
          <Text>Bot Performance</Text>
          <Metric>{botPerformance}</Metric>
        </Card>
      </Grid>

      {/* Detailed Analytics */}
      <TabGroup>
        <TabList>
          <Tab>Conversation Trends</Tab>
          <Tab>User Engagement</Tab>
          <Tab>Bot Performance</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card>
              <Title>Conversation Volume Over Time</Title>
              <AreaChart
                className="h-72 mt-4"
                data={conversationTrends}
                index="date"
                categories={['total']}
                colors={['blue']}
              />
            </Card>
          </TabPanel>

          <TabPanel>
            <Grid numItems={1} numItemsLg={2} className="gap-6">
              <Card>
                <Title>User Engagement by Channel</Title>
                <DonutChart
                  className="h-80 mt-4"
                  data={byChannel}
                  category="value"
                  index="name"
                  colors={['blue', 'cyan', 'indigo']}
                />
                <Legend className="mt-4" categories={byChannel.map((c: ChannelDistribution) => c.name)} />
              </Card>
              <Card>
                <Title>Session Duration Distribution</Title>
                <BarChart
                  className="h-80 mt-4"
                  data={sessionDuration}
                  index="range"
                  categories={['count']}
                  colors={['blue']}
                />
              </Card>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid numItems={1} numItemsLg={2} className="gap-6">
              <Card>
                <Title>Response Time Distribution</Title>
                <BarChart
                  className="h-80 mt-4"
                  data={responseTime}
                  index="range"
                  categories={['count']}
                  colors={['green']}
                />
              </Card>
              <Card>
                <Title>Resolution Rate by Category</Title>
                <DonutChart
                  className="h-80 mt-4"
                  data={resolutionRate}
                  category="value"
                  index="category"
                  colors={['green', 'emerald', 'teal']}
                />
                <Legend className="mt-4" categories={resolutionRate.map((c: ResolutionRate) => c.category)} />
              </Card>
            </Grid>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Real-time Events */}
      <Card>
        <Title>Real-time Events</Title>
        <div className="mt-4 space-y-2">
          {Array.isArray(recentEvents) && recentEvents.length > 0 ? (
            recentEvents.map((event: RecentEvent, index: number) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <Text className="font-medium">{event.eventName || 'Event'}</Text>
                  <Text className="text-sm text-gray-500">
                    {JSON.stringify(event.properties || {})}
                  </Text>
                </div>
                <Text className="text-sm text-gray-500">
                  {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : ''}
                </Text>
              </div>
            ))
          ) : (
            <Text>No recent events.</Text>
          )}
        </div>
      </Card>
    </div>
  );
}; 