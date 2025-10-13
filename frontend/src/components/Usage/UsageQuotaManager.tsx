import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Badge,
  Button,
  ProgressBar,
  Callout,
  Grid,
  Col,
  Metric,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@tremor/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface UsageQuota {
  resourceName: string;
  used: number;
  limit: number;
  unit: string;
}

interface RateLimit {
  endpoint: string;
  requestsPerMinute: number;
  burstLimit: number;
}

const UsageQuotaManager: React.FC = () => {
  const [quotas, setQuotas] = useState<UsageQuota[]>([
    { resourceName: 'API Calls', used: 8500, limit: 10000, unit: 'calls' },
    { resourceName: 'Storage', used: 4.2, limit: 5, unit: 'GB' },
    { resourceName: 'Bandwidth', used: 80, limit: 100, unit: 'GB' },
  ]);

  const [rateLimits] = useState<RateLimit[]>([
    {
      endpoint: '/api/chat',
      requestsPerMinute: 100,
      burstLimit: 10
    },
    {
      endpoint: '/api/analytics',
      requestsPerMinute: 50,
      burstLimit: 5
    }
  ]);

  const [usageHistory] = useState([
    { date: '2024-01', usage: 7500 },
    { date: '2024-02', usage: 8200 },
    { date: '2024-03', usage: 8500 },
  ]);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setQuotas(current =>
          current.map(quota => ({
            ...quota,
            used: Math.min(quota.limit, quota.used + Math.random() * 100)
          }))
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleQuotaAdjustment = (resourceName: string, newLimit: number) => {
    setQuotas(quotas.map(quota =>
      quota.resourceName === resourceName
        ? { ...quota, limit: newLimit }
        : quota
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Resource Usage & Quotas</Title>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsLive(!isLive)}
            color={isLive ? "red" : "blue"}
          >
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
          <Badge color={isLive ? "green" : "gray"}>
            {isLive ? 'Live' : 'Paused'}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        {quotas.map((quota) => (
          <Col key={quota.resourceName}>
            <Card 
              decoration="top" 
              decorationColor={quota.used / quota.limit > 0.9 ? "red" : "blue"}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Text>{quota.resourceName}</Text>
                  <Metric>{`${quota.used.toFixed(1)} / ${quota.limit} ${quota.unit}`}</Metric>
                </div>
                <Badge color={quota.used / quota.limit > 0.9 ? "red" : "blue"}>
                  {`${((quota.used / quota.limit) * 100).toFixed(1)}%`}
                </Badge>
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={(quota.used / quota.limit) * 100}
                  color={quota.used / quota.limit > 0.9 ? "red" : "blue"}
                  className="mt-2"
                />
              </div>
              {quota.used / quota.limit > 0.9 && (
                <Callout
                  className="mt-4"
                  title={`Warning: ${quota.resourceName} usage is near limit`}
                  color="red"
                />
              )}
            </Card>
          </Col>
        ))}
      </Grid>

      {/* Detailed Views */}
      <Card>
        <TabGroup>
          <TabList>
            <Tab>Usage Trends</Tab>
            <Tab>Rate Limits</Tab>
            <Tab>Settings</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageHistory}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                    <XAxis 
                      dataKey="date"
                      className="text-sm text-gray-600"
                    />
                    <YAxis 
                      className="text-sm text-gray-600"
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="mt-4">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Endpoint</TableHeaderCell>
                      <TableHeaderCell>Requests/Minute</TableHeaderCell>
                      <TableHeaderCell>Burst Limit</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rateLimits.map((limit) => (
                      <TableRow key={limit.endpoint}>
                        <TableCell>{limit.endpoint}</TableCell>
                        <TableCell>{limit.requestsPerMinute}</TableCell>
                        <TableCell>{limit.burstLimit}</TableCell>
                        <TableCell>
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => {
                              // Open edit modal
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="mt-4 space-y-4">
                <Card>
                  <Title>Quota Adjustment</Title>
                  <Text className="mt-2">Configure resource limits and thresholds</Text>
                  <div className="mt-4">
                    {quotas.map((quota) => (
                      <div key={quota.resourceName} className="flex items-center justify-between py-2">
                        <Text>{quota.resourceName}</Text>
                        <div className="flex items-center space-x-2">
                          <Text>{quota.limit} {quota.unit}</Text>
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => handleQuotaAdjustment(quota.resourceName, quota.limit + 1000)}
                          >
                            Increase
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default UsageQuotaManager; 