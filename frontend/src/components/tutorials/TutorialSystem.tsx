import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Badge,
  Button,
  List,
  ListItem,
  Title,
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
  videoUrl?: string;
  codeSnippet?: string;
  links?: {
    text: string;
    url: string;
  }[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
  prerequisites?: string[];
  estimatedTime: number; // in minutes
  completionRate: number;
  author: {
    name: string;
    role: string;
  };
  lastUpdated: Date;
}

const TutorialSystem: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [_filter, _setFilter] = useState('all');
  const [_searchTerm, _setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockTutorials: Tutorial[] = [
      {
        id: '1',
        title: 'Getting Started with Our Platform',
        description: 'Learn the basics of our platform and set up your first project.',
        category: 'Onboarding',
        difficulty: 'beginner',
        completionRate: 85,
        estimatedTime: 30,
        author: {
          name: 'Sarah Johnson',
          role: 'Developer Advocate',
        },
        lastUpdated: new Date(),
        steps: [
          {
            id: 's1',
            title: 'Platform Overview',
            description: 'Understanding the key features and components of our platform.',
            duration: 5,
            completed: false,
            videoUrl: 'https://example.com/videos/overview',
          },
          {
            id: 's2',
            title: 'Account Setup',
            description: 'Setting up your account and configuring basic preferences.',
            duration: 10,
            completed: false,
            codeSnippet: `
// Example configuration
{
  "apiKey": "your-api-key",
  "environment": "production",
  "features": {
    "analytics": true,
    "notifications": true
  }
}`,
          },
          {
            id: 's3',
            title: 'First Project',
            description: 'Creating and configuring your first project.',
            duration: 15,
            completed: false,
            links: [
              {
                text: 'Project Templates',
                url: 'https://example.com/templates',
              },
              {
                text: 'Best Practices',
                url: 'https://example.com/best-practices',
              },
            ],
          },
        ],
        prerequisites: ['Basic programming knowledge', 'Familiarity with web technologies'],
      },
      {
        id: '2',
        title: 'Advanced Data Management',
        description: 'Learn advanced techniques for managing and optimizing your data.',
        category: 'Data',
        difficulty: 'advanced',
        completionRate: 45,
        estimatedTime: 60,
        author: {
          name: 'Michael Chen',
          role: 'Senior Engineer',
        },
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        steps: [
          {
            id: 's1',
            title: 'Data Models',
            description: 'Understanding and designing efficient data models.',
            duration: 20,
            completed: false,
            codeSnippet: `
interface DataModel {
  id: string;
  attributes: Record<string, any>;
  relationships: {
    [key: string]: {
      type: string;
      id: string;
    };
  };
}`,
          },
          {
            id: 's2',
            title: 'Query Optimization',
            description: 'Techniques for optimizing database queries and performance.',
            duration: 25,
            completed: false,
            videoUrl: 'https://example.com/videos/query-optimization',
          },
          {
            id: 's3',
            title: 'Data Migration',
            description: 'Strategies for safe and efficient data migration.',
            duration: 15,
            completed: false,
            links: [
              {
                text: 'Migration Patterns',
                url: 'https://example.com/migration-patterns',
              },
            ],
          },
        ],
        prerequisites: [
          'Intermediate programming skills',
          'Database fundamentals',
          'SQL knowledge',
        ],
      },
    ];
    setTutorials(mockTutorials);
  }, []);

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesFilter = _filter === 'all' || tutorial.category === _filter;
    const matchesSearch =
      _searchTerm === '' ||
      tutorial.title.toLowerCase().includes(_searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(_searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = Array.from(new Set(tutorials.map((t) => t.category)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'yellow';
      case 'advanced':
        return 'red';
      default:
        return 'gray';
    }
  };

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (selectedTutorial && currentStep < selectedTutorial.steps.length - 1) {
      const updatedTutorial = { ...selectedTutorial };
      updatedTutorial.steps[currentStep].completed = true;
      setSelectedTutorial(updatedTutorial);
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const exitTutorial = () => {
    setSelectedTutorial(null);
    setCurrentStep(0);
  };

  if (selectedTutorial) {
    const step = selectedTutorial.steps[currentStep];
    const progress = (currentStep / selectedTutorial.steps.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title>{selectedTutorial.title}</Title>
            <Text>Step {currentStep + 1} of {selectedTutorial.steps.length}</Text>
          </div>
          <Button size="sm" variant="secondary" onClick={exitTutorial}>
            Exit Tutorial
          </Button>
        </div>

        <ProgressBar value={progress} color="blue" className="mt-2" />

        <Card>
          <div className="space-y-6">
            <div>
              <Text className="font-medium text-xl">{step.title}</Text>
              <Badge color="gray">
                {step.duration} minutes
              </Badge>
            </div>

            <Text>{step.description}</Text>

            {step.videoUrl && (
              <div className="mt-4">
                <Text className="font-medium">Video Tutorial</Text>
                <div className="mt-2 aspect-video bg-gray-100 rounded flex items-center justify-center">
                  <Text>Video Player Placeholder</Text>
                </div>
              </div>
            )}

            {step.codeSnippet && (
              <div className="mt-4">
                <Text className="font-medium">Code Example</Text>
                <pre className="mt-2 bg-gray-50 p-4 rounded overflow-x-auto">
                  <code>{step.codeSnippet}</code>
                </pre>
              </div>
            )}

            {step.links && step.links.length > 0 && (
              <div className="mt-4">
                <Text className="font-medium">Additional Resources</Text>
                <div className="mt-2 space-y-2">
                  <div>
                    {step.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        {link.text} →
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                size="sm"
                variant="secondary"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={nextStep}
                disabled={currentStep === selectedTutorial.steps.length - 1}
              >
                {currentStep === selectedTutorial.steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title>Tutorials & Guides</Title>
          <Text>Learn how to use our platform effectively</Text>
        </div>
        <div className="space-x-2">
          <Button
            size="xs"
            variant={view === 'grid' ? 'primary' : 'secondary'}
            onClick={() => setView('grid')}
          >
            Grid View
          </Button>
          <Button
            size="xs"
            variant={view === 'list' ? 'primary' : 'secondary'}
            onClick={() => setView('list')}
          >
            List View
          </Button>
        </div>
      </div>

      <Card>
        <TabGroup>
          <TabList>
            <>
              <Tab>All Categories</Tab>
              {categories.map((category) => (
                <Tab key={category}>{category}</Tab>
              ))}
            </>
          </TabList>
          <TabPanels>
            <TabPanel>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredTutorials.map((tutorial) => (
                    <Card key={tutorial.id} className="flex flex-col">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <Text className="font-medium">{tutorial.title}</Text>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge color={getDifficultyColor(tutorial.difficulty)}>
                                {tutorial.difficulty}
                              </Badge>
                              <Badge color="gray">
                                {tutorial.estimatedTime} min
                              </Badge>
                            </div>
                          </div>
                          <Badge color="blue">{tutorial.category}</Badge>
                        </div>
                        <Text className="mt-2 text-gray-500">
                          {tutorial.description}
                        </Text>
                        <div className="mt-4">
                          <Text className="text-sm text-gray-500">
                            Completion rate: {tutorial.completionRate}%
                          </Text>
                          <ProgressBar
                            value={tutorial.completionRate}
                            color="blue"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => startTutorial(tutorial)}
                          className="w-full"
                        >
                          Start Tutorial
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <List>
                  {filteredTutorials.map((tutorial) => (
                    <ListItem key={tutorial.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <Text className="font-medium">{tutorial.title}</Text>
                            <Badge color={getDifficultyColor(tutorial.difficulty)}>
                              {tutorial.difficulty}
                            </Badge>
                            <Badge color="gray">
                              {tutorial.estimatedTime} min
                            </Badge>
                            <Badge color="blue">{tutorial.category}</Badge>
                          </div>
                          <Text className="mt-1 text-gray-500">
                            {tutorial.description}
                          </Text>
                          <div className="mt-2">
                            <Text className="text-sm text-gray-500">
                              Completion rate: {tutorial.completionRate}%
                            </Text>
                            <ProgressBar
                              value={tutorial.completionRate}
                              color="blue"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => startTutorial(tutorial)}
                        >
                          Start Tutorial
                        </Button>
                      </div>
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>
            {categories.map((category) => (
              <TabPanel key={category}>
                <List>
                  {tutorials
                    .filter((t) => t.category === category)
                    .map((tutorial) => (
                      <ListItem key={tutorial.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                              <Text className="font-medium">{tutorial.title}</Text>
                              <Badge color={getDifficultyColor(tutorial.difficulty)}>
                                {tutorial.difficulty}
                              </Badge>
                              <Badge color="gray">
                                {tutorial.estimatedTime} min
                              </Badge>
                            </div>
                            <Text className="mt-1 text-gray-500">
                              {tutorial.description}
                            </Text>
                            <div className="mt-2">
                              <Text className="text-sm text-gray-500">
                                Completion rate: {tutorial.completionRate}%
                              </Text>
                              <ProgressBar
                                value={tutorial.completionRate}
                                color="blue"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => startTutorial(tutorial)}
                          >
                            Start Tutorial
                          </Button>
                        </div>
                      </ListItem>
                    ))}
                </List>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
};

export default TutorialSystem; 