import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Text,
  Badge,
  Button,
  Select,
  SelectItem,
  TextInput,
  DateRangePicker,
  Title,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  resource: {
    type: string;
    id: string;
    name: string;
  };
  details: string;
  status: 'success' | 'failure';
  ipAddress: string;
  metadata?: Record<string, unknown>;
}

interface AuditFilters {
  action: string;
  user: string;
  resource: string;
  status: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  search: string;
}

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    action: '',
    user: '',
    resource: '',
    status: '',
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    search: '',
  });
  const [isLive, setIsLive] = useState(true);
  const [view, setView] = useState<'table' | 'detailed'>('table');

  // Mock data - replace with real API calls
  const fetchLogs = useCallback(async () => {
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(),
        action: 'user.login',
        user: {
          id: 'user1',
          name: 'John Doe',
          role: 'admin',
        },
        resource: {
          type: 'auth',
          id: 'session1',
          name: 'User Session',
        },
        details: 'User logged in successfully',
        status: 'success',
        ipAddress: '192.168.1.1',
        metadata: {
          browser: 'Chrome',
          os: 'Windows',
        },
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        action: 'data.update',
        user: {
          id: 'user2',
          name: 'Jane Smith',
          role: 'editor',
        },
        resource: {
          type: 'document',
          id: 'doc1',
          name: 'Annual Report',
        },
        details: 'Document updated',
        status: 'success',
        ipAddress: '192.168.1.2',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000),
        action: 'settings.change',
        user: {
          id: 'user1',
          name: 'John Doe',
          role: 'admin',
        },
        resource: {
          type: 'system',
          id: 'settings1',
          name: 'System Settings',
        },
        details: 'Failed to update system settings',
        status: 'failure',
        ipAddress: '192.168.1.1',
        metadata: {
          error: 'Invalid configuration',
        },
      },
    ];
    setLogs(prev => [...mockLogs, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(fetchLogs, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLive, fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const matchesAction = !filters.action || log.action === filters.action;
    const matchesUser = !filters.user || log.user.id === filters.user;
    const matchesResource = !filters.resource || log.resource.type === filters.resource;
    const matchesStatus = !filters.status || log.status === filters.status;
    const matchesDateRange =
      log.timestamp >= filters.dateRange.from &&
      log.timestamp <= filters.dateRange.to;
    const matchesSearch =
      !filters.search ||
      log.details.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.resource.name.toLowerCase().includes(filters.search.toLowerCase());

    return (
      matchesAction &&
      matchesUser &&
      matchesResource &&
      matchesStatus &&
      matchesDateRange &&
      matchesSearch
    );
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueUsers = Array.from(new Set(logs.map(log => log.user.id)));
  const uniqueResources = Array.from(new Set(logs.map(log => log.resource.type)));

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'User', 'Resource', 'Details', 'Status', 'IP Address'],
      ...filteredLogs.map(log => [
        format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        log.action,
        log.user.name,
        log.resource.name,
        log.details,
        log.status,
        log.ipAddress,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title>Audit Logs</Title>
          <Text>Track and monitor all system activities</Text>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsLive(!isLive)}
            color={isLive ? "red" : "blue"}
          >
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={exportLogs}
          >
            Export CSV
          </Button>
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
                  <Text>Action</Text>
                  <Select
                    value={filters.action}
                    onValueChange={(value) => setFilters({ ...filters, action: value })}
                  >
                    <SelectItem value="">All Actions</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text>User</Text>
                  <Select
                    value={filters.user}
                    onValueChange={(value) => setFilters({ ...filters, user: value })}
                  >
                    <SelectItem value="">All Users</SelectItem>
                    {uniqueUsers.map((userId) => (
                      <SelectItem key={userId} value={userId}>
                        {logs.find(log => log.user.id === userId)?.user.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text>Resource Type</Text>
                  <Select
                    value={filters.resource}
                    onValueChange={(value) => setFilters({ ...filters, resource: value })}
                  >
                    <SelectItem value="">All Resources</SelectItem>
                    {uniqueResources.map((resource) => (
                      <SelectItem key={resource} value={resource}>
                        {resource}
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
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Text>Search</Text>
                  <TextInput
                    placeholder="Search logs..."
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
                    size="xs"
                    variant={view === 'table' ? 'primary' : 'secondary'}
                    onClick={() => setView('table')}
                  >
                    Table View
                  </Button>
                  <Button
                    size="xs"
                    variant={view === 'detailed' ? 'primary' : 'secondary'}
                    onClick={() => setView('detailed')}
                  >
                    Detailed View
                  </Button>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>

      {view === 'table' ? (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Timestamp</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Resource</TableHeaderCell>
                <TableHeaderCell>Details</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>IP Address</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(log.timestamp, 'MMM d, HH:mm:ss')}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Text>{log.user.name}</Text>
                      <Badge size="sm" color="gray">
                        {log.user.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text>{log.resource.name}</Text>
                    <Text className="text-xs text-gray-500">{log.resource.type}</Text>
                  </TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>
                    <Badge
                      color={log.status === 'success' ? 'green' : 'red'}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <Text className="font-medium">{log.action}</Text>
                    <Badge
                      color={log.status === 'success' ? 'green' : 'red'}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <Text className="text-sm text-gray-500 mt-1">
                    {format(log.timestamp, 'MMM d, yyyy HH:mm:ss')}
                  </Text>
                </div>
                <Badge color="gray">{log.ipAddress}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Text className="font-medium">User</Text>
                  <div className="flex items-center space-x-2 mt-1">
                    <Text>{log.user.name}</Text>
                    <Badge size="sm" color="gray">
                      {log.user.role}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Text className="font-medium">Resource</Text>
                  <div className="mt-1">
                    <Text>{log.resource.name}</Text>
                    <Text className="text-sm text-gray-500">{log.resource.type}</Text>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Text className="font-medium">Details</Text>
                <Text className="mt-1">{log.details}</Text>
              </div>

              {log.metadata && (
                <div className="mt-4">
                  <Text className="font-medium">Additional Information</Text>
                  <pre className="mt-1 bg-gray-50 p-2 rounded text-sm">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogViewer; 