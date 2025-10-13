import React, { useState } from 'react';
import {
  Card,
  Text,
  Button,
  TextInput,
  Select,
  SelectItem,
  Textarea,
  Badge,
  List,
  ListItem,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
} from '@tremor/react';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  status: 'new' | 'in-review' | 'planned' | 'in-progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  submittedAt: Date;
  votes: number;
}

interface NewFeedback {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

const UserFeedbackSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: '1',
      type: 'feature',
      title: 'Dark Mode Support',
      description: 'Add dark mode theme support across the application',
      status: 'planned',
      priority: 'medium',
      submittedBy: 'john.doe@example.com',
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      votes: 42,
    },
    {
      id: '2',
      type: 'bug',
      title: 'Login Error on Safari',
      description: 'Unable to log in using Safari browser on macOS',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'jane.smith@example.com',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      votes: 15,
    },
  ]);

  const [newFeedback, setNewFeedback] = useState<NewFeedback>({
    type: 'feature',
    title: '',
    description: '',
    priority: 'medium',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateFeedback = (feedback: NewFeedback): boolean => {
    if (!feedback.title.trim()) {
      setSubmitError('Please provide a title');
      return false;
    }
    if (!feedback.description.trim()) {
      setSubmitError('Please provide a description');
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const handleSubmitFeedback = () => {
    if (!validateFeedback(newFeedback)) {
      return;
    }

    const feedback: FeedbackItem = {
      id: Date.now().toString(),
      ...newFeedback,
      status: 'new',
      submittedBy: 'current.user@example.com', // Replace with actual user
      submittedAt: new Date(),
      votes: 0,
    };

    setFeedbackItems([feedback, ...feedbackItems]);
    setNewFeedback({
      type: 'feature',
      title: '',
      description: '',
      priority: 'medium',
    });
    setActiveTab(1); // Switch to the View Feedback tab after submission
  };

  const handleVote = (id: string) => {
    setFeedbackItems(
      feedbackItems.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'blue';
      case 'in-review':
        return 'yellow';
      case 'planned':
        return 'purple';
      case 'in-progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'declined':
        return 'red';
      default:
        return 'gray';
    }
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

  const getFeedbackTypeIcon = (type: 'bug' | 'feature' | 'improvement' | 'other') => {
    switch (type) {
      case 'bug':
        return '🐛';
      case 'feature':
        return '✨';
      case 'improvement':
        return '⚡';
      case 'other':
        return '📝';
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">User Feedback System</h2>

      <TabGroup index={activeTab} onIndexChange={setActiveTab}>
        <TabList>
          <Tab>Submit Feedback</Tab>
          <Tab>View Feedback</Tab>
          <Tab>Analytics</Tab>
        </TabList>

        <TabPanels>
          {/* Submit Feedback Panel */}
          <TabPanel>
            <Card>
              <div className="space-y-4">
                <div>
                  <Text>Feedback Type</Text>
                  <Select
                    value={newFeedback.type}
                    onValueChange={(value) =>
                      setNewFeedback({ ...newFeedback, type: value as NewFeedback['type'] })
                    }
                  >
                    <SelectItem value="feature">✨ Feature Request</SelectItem>
                    <SelectItem value="bug">🐛 Bug Report</SelectItem>
                    <SelectItem value="improvement">⚡ Improvement</SelectItem>
                    <SelectItem value="other">📝 Other</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Title</Text>
                  <TextInput
                    placeholder="Brief title for your feedback"
                    value={newFeedback.title}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, title: e.target.value })
                    }
                    error={submitError?.includes('title')}
                  />
                </div>

                <div>
                  <Text>Description</Text>
                  <Textarea
                    placeholder="Detailed description of your feedback"
                    value={newFeedback.description}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, description: e.target.value })
                    }
                    error={submitError?.includes('description')}
                  />
                </div>

                <div>
                  <Text>Priority</Text>
                  <Select
                    value={newFeedback.priority}
                    onValueChange={(value) =>
                      setNewFeedback({ ...newFeedback, priority: value as NewFeedback['priority'] })
                    }
                  >
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🔴 High</SelectItem>
                  </Select>
                </div>

                {submitError && (
                  <Text color="red" className="text-sm">
                    {submitError}
                  </Text>
                )}

                <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
              </div>
            </Card>
          </TabPanel>

          {/* View Feedback Panel */}
          <TabPanel>
            <Card>
              <List>
                {feedbackItems.map((item) => (
                  <ListItem key={item.id}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{getFeedbackTypeIcon(item.type)}</span>
                            <Text className="font-semibold">{item.title}</Text>
                          </div>
                          <div className="flex space-x-2 mt-1">
                            <Badge color="gray">{item.type}</Badge>
                            <Badge color={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <Badge color={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => handleVote(item.id)}
                          className="hover:bg-blue-50"
                        >
                          👍 {item.votes}
                        </Button>
                      </div>
                      <Text className="text-gray-600">{item.description}</Text>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Submitted by {item.submittedBy}</span>
                        <span>
                          {new Date(item.submittedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Card>
          </TabPanel>

          {/* Analytics Panel */}
          <TabPanel>
            <Card>
              <div className="space-y-4">
                <div>
                  <Text className="font-semibold">Feedback Statistics</Text>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <Card decoration="top" decorationColor="blue">
                      <Text>Total Feedback</Text>
                      <Text className="text-2xl font-bold">
                        {feedbackItems.length}
                      </Text>
                    </Card>
                    <Card decoration="top" decorationColor="green">
                      <Text>Open Items</Text>
                      <Text className="text-2xl font-bold">
                        {
                          feedbackItems.filter(
                            (item) =>
                              !['completed', 'declined'].includes(item.status)
                          ).length
                        }
                      </Text>
                    </Card>
                    <Card decoration="top" decorationColor="purple">
                      <Text>Total Votes</Text>
                      <Text className="text-2xl font-bold">
                        {feedbackItems.reduce((sum, item) => sum + item.votes, 0)}
                      </Text>
                    </Card>
                  </div>
                </div>

                {/* Add more analytics visualizations here */}
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default UserFeedbackSystem; 