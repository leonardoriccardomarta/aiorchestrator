import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Text,
  Badge,
  List,
  ListItem,
  Button,
  Title,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'system' | 'user' | 'integration';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  group?: string;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface NotificationGroup {
  name: string;
  notifications: Notification[];
  unreadCount: number;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notificationSound] = useState(new Audio('/notification.mp3'));
  const [groupedView, setGroupedView] = useState(false);
  const [isLive, setIsLive] = useState(true);

  // Mock notifications - replace with real API calls
  const fetchNotifications = useCallback(async () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'system',
        title: 'System Update',
        message: 'A new system update is available. Please restart your application.',
        timestamp: new Date(),
        read: false,
        priority: 'high',
        group: 'Updates',
        actions: [
          {
            label: 'Update Now',
            onClick: () => console.log('Update initiated'),
          },
          {
            label: 'Remind Later',
            onClick: () => console.log('Reminder set'),
          },
        ],
      },
      {
        id: '2',
        type: 'user',
        title: 'New Message',
        message: 'You have received a new message from Jane Smith.',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        priority: 'medium',
        group: 'Messages',
        actions: [
          {
            label: 'View Message',
            onClick: () => console.log('Opening message'),
          },
        ],
      },
      {
        id: '3',
        type: 'integration',
        title: 'Integration Alert',
        message: 'GitHub integration requires reauthorization.',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        priority: 'high',
        group: 'Integrations',
        actions: [
          {
            label: 'Reauthorize',
            onClick: () => console.log('Reauthorizing'),
          },
        ],
      },
    ];
    setNotifications(prev => [...mockNotifications, ...prev].slice(0, 50)); // Keep last 50 notifications
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLive, fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (showUnreadOnly && notif.read) return false;
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const getGroupedNotifications = (): NotificationGroup[] => {
    const groups: { [key: string]: NotificationGroup } = {};
    
    filteredNotifications.forEach(notification => {
      const groupName = notification.group || 'Other';
      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          notifications: [],
          unreadCount: 0
        };
      }
      groups[groupName].notifications.push(notification);
      if (!notification.read) {
        groups[groupName].unreadCount++;
      }
    });

    return Object.values(groups).sort((a, b) => b.unreadCount - a.unreadCount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return '';
      case 'user':
        return '👤';
      case 'integration':
        return '🔌';
      default:
        return '📢';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title>Notifications</Title>
          <Text>Stay updated with system alerts and messages</Text>
        </div>
        <div className="flex items-center space-x-4">
          <Badge color={unreadCount > 0 ? "red" : "gray"} size="lg">
            {unreadCount} unread
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsLive(!isLive)}
            color={isLive ? "red" : "blue"}
          >
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
        </div>
      </div>

      <Card>
        <TabGroup>
          <TabList>
            <Tab>View Options</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="p-4 space-y-4">
                <div>
                  <Text>Filter by Type</Text>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="xs"
                      variant={filter === 'all' ? 'primary' : 'secondary'}
                      onClick={() => setFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      size="xs"
                      variant={filter === 'system' ? 'primary' : 'secondary'}
                      onClick={() => setFilter('system')}
                    >
                      System
                    </Button>
                    <Button
                      size="xs"
                      variant={filter === 'user' ? 'primary' : 'secondary'}
                      onClick={() => setFilter('user')}
                    >
                      User
                    </Button>
                    <Button
                      size="xs"
                      variant={filter === 'integration' ? 'primary' : 'secondary'}
                      onClick={() => setFilter('integration')}
                    >
                      Integration
                    </Button>
                  </div>
                </div>

                <div>
                  <Text>View Type</Text>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="xs"
                      variant={!groupedView ? 'primary' : 'secondary'}
                      onClick={() => setGroupedView(false)}
                    >
                      List View
                    </Button>
                    <Button
                      size="xs"
                      variant={groupedView ? 'primary' : 'secondary'}
                      onClick={() => setGroupedView(true)}
                    >
                      Grouped View
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  >
                    {showUnreadOnly ? 'Show All' : 'Show Unread Only'}
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark All as Read
                  </Button>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="p-4 space-y-4">
                <div>
                  <Text>Notification Sound</Text>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => notificationSound.play()}
                    className="mt-2"
                  >
                    Test Sound
                  </Button>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>

      {groupedView ? (
        <div className="space-y-6">
          {getGroupedNotifications().map((group) => (
            <Card key={group.name}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Text className="font-medium">{group.name}</Text>
                  {group.unreadCount > 0 && (
                    <Badge color="red">{group.unreadCount} new</Badge>
                  )}
                </div>
              </div>
              <List>
                {group.notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    className={`py-4 ${notification.read ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 text-2xl">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2">
                          <Text className="font-medium">{notification.title}</Text>
                          {!notification.read && <Badge color="blue">New</Badge>}
                          <Badge color={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <Text className="text-gray-500 mt-1">{notification.message}</Text>
                        {notification.actions && (
                          <div className="mt-2 space-x-2">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="xs"
                                variant="secondary"
                                onClick={action.onClick}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 space-y-2">
                        <Text className="text-sm text-gray-500">
                          {format(notification.timestamp, 'MMM d, HH:mm')}
                        </Text>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <List>
            {filteredNotifications.map((notification) => (
              <ListItem
                key={notification.id}
                className={`py-4 ${notification.read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-2xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-2">
                      <Text className="font-medium">{notification.title}</Text>
                      {!notification.read && <Badge color="blue">New</Badge>}
                      <Badge color={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      {notification.group && (
                        <Badge color="gray">{notification.group}</Badge>
                      )}
                    </div>
                    <Text className="text-gray-500 mt-1">{notification.message}</Text>
                    {notification.actions && (
                      <div className="mt-2 space-x-2">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="xs"
                            variant="secondary"
                            onClick={action.onClick}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 space-y-2 text-right">
                    <Text className="text-sm text-gray-500">
                      {format(notification.timestamp, 'MMM d, HH:mm')}
                    </Text>
                    <div className="space-x-2">
                      {!notification.read && (
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter; 