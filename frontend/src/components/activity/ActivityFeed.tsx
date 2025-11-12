import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Text,
  Badge,
  List,
  ListItem,
  Button,
  Select,
  SelectItem,
  TextInput,
  DateRangePicker,
  Title,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'user' | 'system' | 'integration';
  action: string;
  description: string;
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  metadata?: Record<string, unknown>;
  category?: string;
  status?: 'success' | 'warning' | 'error';
}

interface ActivityFilters {
  type: string;
  search: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  category: string;
  status: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<ActivityFilters>({
    type: '',
    search: '',
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    category: '',
    status: '',
  });
  const [isLive, setIsLive] = useState(true);
  const [view, setView] = useState<'all' | 'grouped'>('all');

  // Mock data - replace with real API calls
  const fetchActivities = useCallback(async () => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'user',
        action: 'login',
        description: 'User logged into the system',
        timestamp: new Date(),
        category: 'Authentication',
        status: 'success',
        user: {
          id: 'user1',
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
        },
      },
      {
        id: '2',
        type: 'system',
        action: 'backup',
        description: 'System backup completed successfully',
        timestamp: new Date(Date.now() - 3600000),
        category: 'Maintenance',
        status: 'success',
      },
      {
        id: '3',
        type: 'integration',
        action: 'webhook',
        description: 'Webhook received from external service',
        timestamp: new Date(Date.now() - 7200000),
        category: 'Integration',
        status: 'warning',
        metadata: {
          service: 'GitHub',
          event: 'push',
        },
      },
    ];
    setActivities(prev => [...mockActivities, ...prev].slice(0, 50)); // Keep last 50 activities
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(fetchActivities, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLive, fetchActivities]);

  const filteredActivities = activities.filter((activity) => {
    const matchesType = !filters.type || activity.type === filters.type;
    const matchesSearch =
      !filters.search ||
      activity.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.action.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDateRange =
      activity.timestamp >= filters.dateRange.from &&
      activity.timestamp <= filters.dateRange.to;
    const matchesCategory = !filters.category || activity.category === filters.category;
    const matchesStatus = !filters.status || activity.status === filters.status;

    return matchesType && matchesSearch && matchesDateRange && matchesCategory && matchesStatus;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(activity.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return '👤';
      case 'system':
        return '';
      case 'integration':
        return '🔌';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const categories = Array.from(new Set(activities.map(a => a.category).filter(Boolean))) as string[];
  const statuses = Array.from(new Set(activities.map(a => a.status).filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title>Activity Feed</Title>
          <Text>Track all system activities and events</Text>
        </div>
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

      <Card>
        <TabGroup>
          <TabList>
            <Tab>Filters</Tab>
            <Tab>View Options</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <div>
                  <Text>Activity Type</Text>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                  >
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Category</Text>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text>Status</Text>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectItem value="">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Text>Search</Text>
                  <TextInput
                    placeholder="Search activities..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>

                <div>
                  <Text>Date Range</Text>
                  <DateRangePicker
                    value={filters.dateRange}
                    onValueChange={(value) => {
                      if (value.from && value.to) {
                        setFilters({ ...filters, dateRange: { from: value.from, to: value.to } });
                      }
                    }}
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="p-4">
                <Text>View Type</Text>
                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant={view === 'all' ? 'primary' : 'secondary'}
                    onClick={() => setView('all')}
                  >
                    All Activities
                  </Button>
                  <Button
                    size="sm"
                    variant={view === 'grouped' ? 'primary' : 'secondary'}
                    onClick={() => setView('grouped')}
                  >
                    Grouped by Date
                  </Button>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>

      {view === 'all' ? (
        <Card>
          <List>
            {filteredActivities.map((activity) => (
              <ListItem key={activity.id} className="py-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-2">
                      <Text className="font-medium">{activity.action}</Text>
                      <Badge color={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      {activity.category && (
                        <Badge color="gray">{activity.category}</Badge>
                      )}
                    </div>
                    <Text className="text-slate-500 mt-1">{activity.description}</Text>
                    {activity.metadata && (
                      <div className="mt-2 text-sm text-slate-500">
                        <pre className="bg-slate-50 p-2 rounded">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-sm text-slate-500">
                    {format(activity.timestamp, 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <Card key={date}>
              <div className="border-b border-slate-200 pb-2 mb-4">
                <Text className="font-medium">{format(new Date(date), 'MMMM d, yyyy')}</Text>
              </div>
              <List>
                {activities.map((activity) => (
                  <ListItem key={activity.id} className="py-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 text-2xl">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2">
                          <Text className="font-medium">{activity.action}</Text>
                          <Badge color={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                          {activity.category && (
                            <Badge color="gray">{activity.category}</Badge>
                          )}
                        </div>
                        <Text className="text-slate-500 mt-1">{activity.description}</Text>
                      </div>
                      <div className="flex-shrink-0 text-sm text-slate-500">
                        {format(activity.timestamp, 'HH:mm')}
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed; 
