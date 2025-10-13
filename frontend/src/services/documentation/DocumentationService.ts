import { analyticsService } from '../analytics/AnalyticsService';

// Documentation Types
export enum DocumentationType {
  USER_GUIDE = 'user_guide',
  API_DOCS = 'api_docs',
  DEVELOPER_DOCS = 'developer_docs',
  TUTORIAL = 'tutorial',
  VIDEO_TUTORIAL = 'video_tutorial',
  INTERACTIVE_TUTORIAL = 'interactive_tutorial',
  BEST_PRACTICES = 'best_practices',
  TROUBLESHOOTING = 'troubleshooting'
}

export enum DocumentationStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum TutorialDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// Documentation Article
export interface DocumentationArticle {
  id: string;
  title: string;
  content: string;
  type: DocumentationType;
  status: DocumentationStatus;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  version: string;
  language: string;
  estimatedReadingTime: number; // in minutes
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  searchScore: number;
  relatedArticles: string[];
  tableOfContents: Array<{
    id: string;
    title: string;
    level: number;
    anchor: string;
  }>;
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    lastReviewed?: Date;
    reviewerId?: string;
    reviewerName?: string;
  };
}

// API Documentation
export interface APIDocumentation {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  title: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  requestBody?: {
    schema: string;
    example: string;
    description: string;
  };
  responses: Array<{
    code: number;
    description: string;
    schema: string;
    example: string;
  }>;
  authentication: string[];
  rateLimit?: string;
  deprecated?: boolean;
  version: string;
  tags: string[];
  examples: Array<{
    language: string;
    code: string;
    description: string;
  }>;
}

// Interactive Tutorial
export interface InteractiveTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: TutorialDifficulty;
  estimatedDuration: number; // in minutes
  steps: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    type: 'text' | 'code' | 'video' | 'interactive' | 'quiz';
    codeExample?: {
      language: string;
      code: string;
      output?: string;
    };
    videoUrl?: string;
    interactiveElement?: {
      type: 'sandbox' | 'quiz' | 'exercise';
      config: Record<string, any>;
    };
    completed: boolean;
  }>;
  prerequisites: string[];
  learningObjectives: string[];
  completionCertificate: boolean;
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
}

// Video Tutorial
export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  difficulty: TutorialDifficulty;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  transcript: Array<{
    timestamp: number;
    text: string;
  }>;
  chapters: Array<{
    timestamp: number;
    title: string;
  }>;
  relatedVideos: string[];
  downloadable: boolean;
  subtitles: Array<{
    language: string;
    url: string;
  }>;
}

// Certification Program
export interface CertificationProgram {
  id: string;
  title: string;
  description: string;
  difficulty: TutorialDifficulty;
  duration: number; // in hours
  modules: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    duration: number; // in minutes
    quizzes: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
    completed: boolean;
    score?: number;
  }>;
  prerequisites: string[];
  learningObjectives: string[];
  certificateTemplate: {
    title: string;
    description: string;
    logoUrl: string;
    validFor: number; // in months
  };
  passingScore: number; // percentage
  maxAttempts: number;
  enrolledUsers: string[];
  completedUsers: string[];
  averageScore: number;
  completionRate: number;
}

// Documentation Service
export class DocumentationService {
  private articles: Map<string, DocumentationArticle> = new Map();
  private apiDocs: Map<string, APIDocumentation> = new Map();
  private interactiveTutorials: Map<string, InteractiveTutorial> = new Map();
  private videoTutorials: Map<string, VideoTutorial> = new Map();
  private certificationPrograms: Map<string, CertificationProgram> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    this.setupDefaultData();
    this.setupEventListeners();
    this.startAnalyticsTracking();
    
    this.isInitialized = true;
  }

  private setupDefaultData(): void {
    this.setupDefaultArticles();
    this.setupDefaultAPIDocs();
    this.setupDefaultTutorials();
    this.setupDefaultCertificationPrograms();
  }

  private setupDefaultArticles(): void {
    const defaultArticles: Omit<DocumentationArticle, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'searchScore' | 'relatedArticles' | 'tableOfContents'>[] = [
      {
        title: 'Getting Started with AI Orchestrator',
        content: `
# Getting Started with AI Orchestrator

Welcome to AI Orchestrator! This guide will help you get started with creating and managing your first AI chatbot.

## Prerequisites

Before you begin, make sure you have:
- A valid email address
- A modern web browser
- Basic understanding of AI concepts

## Step 1: Create Your Account

1. Visit the AI Orchestrator website
2. Click "Sign Up" in the top right corner
3. Enter your email address and create a password
4. Verify your email address

## Step 2: Create Your First Chatbot

1. Log in to your dashboard
2. Click "Create New Chatbot"
3. Choose a template or start from scratch
4. Configure your chatbot settings

## Step 3: Train Your Chatbot

1. Add training data to your chatbot
2. Configure response patterns
3. Test your chatbot
4. Deploy to your website

## Next Steps

- Read our [Advanced Configuration Guide](/docs/advanced-configuration)
- Check out our [API Documentation](/docs/api)
- Join our [Community Forum](/community)
        `,
        type: DocumentationType.USER_GUIDE,
        status: DocumentationStatus.PUBLISHED,
        category: 'Getting Started',
        tags: ['onboarding', 'setup', 'beginner', 'first-steps'],
        authorId: 'admin-1',
        authorName: 'AI Orchestrator Team',
        version: '1.0.0',
        language: 'en',
        estimatedReadingTime: 15,
        metadata: {
          seoTitle: 'Getting Started with AI Orchestrator - Complete Guide',
          seoDescription: 'Learn how to create your first AI chatbot with AI Orchestrator. Step-by-step guide for beginners.',
          keywords: ['AI chatbot', 'getting started', 'tutorial', 'setup'],
          lastReviewed: new Date(),
          reviewerId: 'admin-1',
          reviewerName: 'AI Orchestrator Team'
        }
      },
      {
        title: 'API Authentication Guide',
        content: `
# API Authentication Guide

Learn how to authenticate with the AI Orchestrator API.

## Authentication Methods

### API Keys

The primary method of authentication is using API keys.

\`\`\`javascript
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};
\`\`\`

### OAuth 2.0

For advanced integrations, we support OAuth 2.0.

## Rate Limiting

- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise: Custom limits

## Error Handling

Common error codes and their meanings.
        `,
        type: DocumentationType.API_DOCS,
        status: DocumentationStatus.PUBLISHED,
        category: 'API',
        tags: ['api', 'authentication', 'oauth', 'rate-limiting'],
        authorId: 'admin-1',
        authorName: 'AI Orchestrator Team',
        version: '1.0.0',
        language: 'en',
        estimatedReadingTime: 10,
        metadata: {
          seoTitle: 'API Authentication Guide - AI Orchestrator',
          seoDescription: 'Complete guide to API authentication with AI Orchestrator. Learn about API keys, OAuth, and rate limiting.',
          keywords: ['API', 'authentication', 'OAuth', 'rate limiting'],
          lastReviewed: new Date(),
          reviewerId: 'admin-1',
          reviewerName: 'AI Orchestrator Team'
        }
      }
    ];

    defaultArticles.forEach((article, index) => {
      const articleId = `article-${index + 1}`;
      const now = new Date();
      
      this.articles.set(articleId, {
        ...article,
        id: articleId,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        helpfulCount: Math.floor(Math.random() * 50) + 10,
        notHelpfulCount: Math.floor(Math.random() * 5),
        searchScore: 0.95 - (index * 0.05),
        relatedArticles: [],
        tableOfContents: this.generateTableOfContents(article.content)
      });
    });
  }

  private setupDefaultAPIDocs(): void {
    const defaultAPIs: Omit<APIDocumentation, 'id'>[] = [
      {
        endpoint: '/api/v1/chatbots',
        method: 'GET',
        title: 'List Chatbots',
        description: 'Retrieve a list of all chatbots for the authenticated user.',
        parameters: [
          {
            name: 'page',
            type: 'integer',
            required: false,
            description: 'Page number for pagination',
            example: '1'
          },
          {
            name: 'limit',
            type: 'integer',
            required: false,
            description: 'Number of items per page',
            example: '10'
          }
        ],
        responses: [
          {
            code: 200,
            description: 'Success',
            schema: 'ChatbotListResponse',
            example: JSON.stringify({
              data: [
                {
                  id: 'chatbot-1',
                  name: 'My Chatbot',
                  status: 'active',
                  createdAt: '2024-01-01T00:00:00Z'
                }
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 1
              }
            }, null, 2)
          },
          {
            code: 401,
            description: 'Unauthorized',
            schema: 'ErrorResponse',
            example: JSON.stringify({
              error: 'Unauthorized',
              message: 'Invalid API key'
            }, null, 2)
          }
        ],
        authentication: ['api_key'],
        version: 'v1',
        tags: ['chatbots', 'list'],
        examples: [
          {
            language: 'javascript',
            code: `
const response = await fetch('/api/v1/chatbots', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const chatbots = await response.json();
            `,
            description: 'JavaScript example'
          },
          {
            language: 'python',
            code: `
import requests

response = requests.get(
    'https://api.aiorchestrator.com/api/v1/chatbots',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
chatbots = response.json()
            `,
            description: 'Python example'
          }
        ]
      },
      {
        endpoint: '/api/v1/chatbots',
        method: 'POST',
        title: 'Create Chatbot',
        description: 'Create a new chatbot.',
        parameters: [],
        requestBody: {
          schema: 'CreateChatbotRequest',
          example: JSON.stringify({
            name: 'My New Chatbot',
            description: 'A helpful chatbot for customer support',
            settings: {
              language: 'en',
              personality: 'friendly'
            }
          }, null, 2),
          description: 'Chatbot configuration'
        },
        responses: [
          {
            code: 201,
            description: 'Created',
            schema: 'ChatbotResponse',
            example: JSON.stringify({
              id: 'chatbot-2',
              name: 'My New Chatbot',
              status: 'active',
              createdAt: '2024-01-01T00:00:00Z'
            }, null, 2)
          }
        ],
        authentication: ['api_key'],
        version: 'v1',
        tags: ['chatbots', 'create'],
        examples: [
          {
            language: 'javascript',
            code: `
const response = await fetch('/api/v1/chatbots', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My New Chatbot',
    description: 'A helpful chatbot'
  })
});
const chatbot = await response.json();
            `,
            description: 'JavaScript example'
          }
        ]
      }
    ];

    defaultAPIs.forEach((api, index) => {
      const apiId = `api-${index + 1}`;
      this.apiDocs.set(apiId, {
        ...api,
        id: apiId
      });
    });
  }

  private setupDefaultTutorials(): void {
    const defaultInteractiveTutorials: Omit<InteractiveTutorial, 'id' | 'progress' | 'startedAt' | 'completedAt'>[] = [
      {
        title: 'Building Your First Chatbot',
        description: 'Learn how to create and configure your first AI chatbot from scratch.',
        difficulty: TutorialDifficulty.BEGINNER,
        estimatedDuration: 30,
        steps: [
          {
            id: 'step-1',
            title: 'Introduction to AI Chatbots',
            description: 'Learn the basics of AI chatbots and how they work.',
            content: 'AI chatbots are computer programs that can simulate human conversation...',
            type: 'text',
            completed: false
          },
          {
            id: 'step-2',
            title: 'Setting Up Your Environment',
            description: 'Configure your development environment.',
            content: 'Before we start building, let\'s set up your environment...',
            type: 'interactive',
            interactiveElement: {
              type: 'sandbox',
              config: {
                template: 'basic-chatbot',
                language: 'javascript'
              }
            },
            completed: false
          },
          {
            id: 'step-3',
            title: 'Creating Your First Bot',
            description: 'Create your first chatbot using our platform.',
            content: 'Now let\'s create your first chatbot...',
            type: 'code',
            codeExample: {
              language: 'javascript',
              code: `
// Create a new chatbot
const chatbot = new AIChatbot({
  name: 'My First Bot',
  personality: 'friendly'
});
              `,
              output: 'Chatbot created successfully!'
            },
            completed: false
          }
        ],
        prerequisites: [],
        learningObjectives: [
          'Understand AI chatbot fundamentals',
          'Set up development environment',
          'Create your first chatbot',
          'Deploy chatbot to production'
        ],
        completionCertificate: true
      }
    ];

    const defaultVideoTutorials: Omit<VideoTutorial, 'id' | 'createdAt' | 'viewCount' | 'likeCount' | 'dislikeCount' | 'relatedVideos' | 'subtitles'>[] = [
      {
        title: 'Complete AI Orchestrator Tutorial',
        description: 'A comprehensive tutorial covering all aspects of AI Orchestrator.',
        videoUrl: 'https://example.com/videos/complete-tutorial.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/tutorial.jpg',
        duration: 1800, // 30 minutes
        difficulty: TutorialDifficulty.BEGINNER,
        category: 'Getting Started',
        tags: ['tutorial', 'beginner', 'complete'],
        authorId: 'admin-1',
        authorName: 'AI Orchestrator Team',
        transcript: [
          { timestamp: 0, text: 'Welcome to AI Orchestrator tutorial...' },
          { timestamp: 30, text: 'In this tutorial, we will cover...' }
        ],
        chapters: [
          { timestamp: 0, title: 'Introduction' },
          { timestamp: 300, title: 'Setting Up Your Account' },
          { timestamp: 600, title: 'Creating Your First Chatbot' }
        ],
        downloadable: true
      }
    ];

    defaultInteractiveTutorials.forEach((tutorial, index) => {
      const tutorialId = `tutorial-${index + 1}`;
      this.interactiveTutorials.set(tutorialId, {
        ...tutorial,
        id: tutorialId,
        progress: 0
      });
    });

    defaultVideoTutorials.forEach((video, index) => {
      const videoId = `video-${index + 1}`;
      const now = new Date();
      this.videoTutorials.set(videoId, {
        ...video,
        id: videoId,
        createdAt: now,
        publishedAt: now,
        viewCount: Math.floor(Math.random() * 5000) + 1000,
        likeCount: Math.floor(Math.random() * 200) + 50,
        dislikeCount: Math.floor(Math.random() * 10),
        relatedVideos: [],
        subtitles: [
          { language: 'en', url: 'https://example.com/subtitles/en.vtt' },
          { language: 'es', url: 'https://example.com/subtitles/es.vtt' }
        ]
      });
    });
  }

  private setupDefaultCertificationPrograms(): void {
    const defaultPrograms: Omit<CertificationProgram, 'id' | 'enrolledUsers' | 'completedUsers' | 'averageScore' | 'completionRate'>[] = [
      {
        title: 'AI Orchestrator Certified Developer',
        description: 'Become a certified AI Orchestrator developer with this comprehensive program.',
        difficulty: TutorialDifficulty.INTERMEDIATE,
        duration: 20,
        modules: [
          {
            id: 'module-1',
            title: 'Fundamentals of AI Chatbots',
            description: 'Learn the basics of AI chatbots and natural language processing.',
            content: 'This module covers the fundamental concepts...',
            duration: 120,
            quizzes: [
              {
                id: 'quiz-1',
                question: 'What is the primary purpose of an AI chatbot?',
                options: [
                  'To replace human customer service',
                  'To automate repetitive conversations',
                  'To provide 24/7 customer support',
                  'All of the above'
                ],
                correctAnswer: 3,
                explanation: 'AI chatbots serve multiple purposes including automation and 24/7 support.'
              }
            ],
            completed: false
          },
          {
            id: 'module-2',
            title: 'Advanced Configuration',
            description: 'Learn advanced configuration techniques for AI Orchestrator.',
            content: 'This module covers advanced configuration...',
            duration: 180,
            quizzes: [
              {
                id: 'quiz-2',
                question: 'Which API endpoint is used to create a new chatbot?',
                options: [
                  'GET /api/v1/chatbots',
                  'POST /api/v1/chatbots',
                  'PUT /api/v1/chatbots',
                  'DELETE /api/v1/chatbots'
                ],
                correctAnswer: 1,
                explanation: 'POST /api/v1/chatbots is used to create new chatbots.'
              }
            ],
            completed: false
          }
        ],
        prerequisites: ['Basic programming knowledge', 'Understanding of APIs'],
        learningObjectives: [
          'Understand AI chatbot fundamentals',
          'Master AI Orchestrator platform',
          'Build and deploy chatbots',
          'Integrate chatbots with applications'
        ],
        certificateTemplate: {
          title: 'AI Orchestrator Certified Developer',
          description: 'This certifies that the holder has successfully completed the AI Orchestrator Developer certification program.',
          logoUrl: 'https://example.com/certificate-logo.png',
          validFor: 24
        },
        passingScore: 80,
        maxAttempts: 3
      }
    ];

    defaultPrograms.forEach((program, index) => {
      const programId = `cert-${index + 1}`;
      this.certificationPrograms.set(programId, {
        ...program,
        id: programId,
        enrolledUsers: [],
        completedUsers: [],
        averageScore: 0,
        completionRate: 0
      });
    });
  }

  private setupEventListeners(): void {
    // Listen for documentation interactions
    document.addEventListener('documentation-viewed', (event: any) => {
      this.handleDocumentationViewed(event.detail);
    });

    document.addEventListener('tutorial-started', (event: any) => {
      this.handleTutorialStarted(event.detail);
    });

    document.addEventListener('certification-enrolled', (event: any) => {
      this.handleCertificationEnrolled(event.detail);
    });
  }

  private startAnalyticsTracking(): void {
    // Track documentation usage
    setInterval(() => {
      this.updateSearchScores();
    }, 300000); // Every 5 minutes
  }

  private handleDocumentationViewed(articleData: any): void {
    analyticsService.track('documentation_viewed', {
      articleId: articleData.id,
      type: articleData.type,
      category: articleData.category
    });
  }

  private handleTutorialStarted(tutorialData: any): void {
    analyticsService.track('tutorial_started', {
      tutorialId: tutorialData.id,
      type: tutorialData.type,
      difficulty: tutorialData.difficulty
    });
  }

  private handleCertificationEnrolled(certData: any): void {
    analyticsService.track('certification_enrolled', {
      programId: certData.id,
      title: certData.title
    });
  }

  private updateSearchScores(): void {
    this.articles.forEach((article, articleId) => {
      const newScore = this.calculateSearchScore(article);
      if (newScore !== article.searchScore) {
        this.articles.set(articleId, {
          ...article,
          searchScore: newScore
        });
      }
    });
  }

  private calculateSearchScore(article: DocumentationArticle): number {
    let score = 0.5; // Base score

    // Boost for recent articles
    const daysSincePublished = (Date.now() - article.publishedAt!.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 30) score += 0.2;
    else if (daysSincePublished < 90) score += 0.1;

    // Boost for popular articles
    if (article.viewCount > 1000) score += 0.2;
    else if (article.viewCount > 500) score += 0.1;

    // Boost for helpful articles
    const helpfulRatio = article.helpfulCount / (article.helpfulCount + article.notHelpfulCount);
    if (helpfulRatio > 0.9) score += 0.2;
    else if (helpfulRatio > 0.8) score += 0.1;

    return Math.min(1.0, score);
  }

  private generateTableOfContents(content: string): Array<{ id: string; title: string; level: number; anchor: string }> {
    const toc: Array<{ id: string; title: string; level: number; anchor: string }> = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2];
        const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        toc.push({
          id: `toc-${index}`,
          title,
          level,
          anchor
        });
      }
    });
    
    return toc;
  }

  // Public Methods

  public createArticle(articleData: Omit<DocumentationArticle, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'searchScore' | 'relatedArticles' | 'tableOfContents'>): DocumentationArticle {
    const articleId = this.generateId();
    const now = new Date();
    
    const article: DocumentationArticle = {
      ...articleData,
      id: articleId,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      searchScore: 0.5,
      relatedArticles: [],
      tableOfContents: this.generateTableOfContents(articleData.content)
    };

    this.articles.set(articleId, article);
    return article;
  }

  public getArticle(articleId: string): DocumentationArticle | null {
    return this.articles.get(articleId) || null;
  }

  public searchArticles(query: string): DocumentationArticle[] {
    const articles = Array.from(this.articles.values());
    const searchTerms = query.toLowerCase().split(' ');
    
    return articles
      .filter(article => article.status === DocumentationStatus.PUBLISHED)
      .map(article => {
        const titleScore = searchTerms.filter(term => 
          article.title.toLowerCase().includes(term)
        ).length;
        const contentScore = searchTerms.filter(term => 
          article.content.toLowerCase().includes(term)
        ).length;
        const tagScore = searchTerms.filter(term => 
          article.tags.some(tag => tag.toLowerCase().includes(term))
        ).length;
        
        const totalScore = titleScore * 3 + contentScore * 2 + tagScore * 2 + article.searchScore * 10;
        
        return { article, score: totalScore };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.article);
  }

  public getArticlesByType(type: DocumentationType): DocumentationArticle[] {
    return Array.from(this.articles.values())
      .filter(article => article.type === type && article.status === DocumentationStatus.PUBLISHED)
      .sort((a, b) => b.viewCount - a.viewCount);
  }

  public getArticlesByCategory(category: string): DocumentationArticle[] {
    return Array.from(this.articles.values())
      .filter(article => article.category === category && article.status === DocumentationStatus.PUBLISHED)
      .sort((a, b) => b.viewCount - a.viewCount);
  }

  public updateArticle(articleId: string, updates: Partial<DocumentationArticle>): DocumentationArticle | null {
    const article = this.articles.get(articleId);
    if (!article) return null;

    const updatedArticle: DocumentationArticle = {
      ...article,
      ...updates,
      updatedAt: new Date(),
      tableOfContents: updates.content ? this.generateTableOfContents(updates.content) : article.tableOfContents
    };

    this.articles.set(articleId, updatedArticle);
    return updatedArticle;
  }

  public incrementViewCount(articleId: string): void {
    const article = this.articles.get(articleId);
    if (article) {
      this.articles.set(articleId, {
        ...article,
        viewCount: article.viewCount + 1
      });
    }
  }

  public createAPIDocumentation(apiData: Omit<APIDocumentation, 'id'>): APIDocumentation {
    const apiId = this.generateId();
    
    const apiDoc: APIDocumentation = {
      ...apiData,
      id: apiId
    };

    this.apiDocs.set(apiId, apiDoc);
    return apiDoc;
  }

  public getAPIDocumentation(apiId: string): APIDocumentation | null {
    return this.apiDocs.get(apiId) || null;
  }

  public getAllAPIDocumentation(): APIDocumentation[] {
    return Array.from(this.apiDocs.values());
  }

  public searchAPIDocumentation(query: string): APIDocumentation[] {
    const apis = Array.from(this.apiDocs.values());
    const searchTerms = query.toLowerCase().split(' ');
    
    return apis
      .map(api => {
        const titleScore = searchTerms.filter(term => 
          api.title.toLowerCase().includes(term)
        ).length;
        const descriptionScore = searchTerms.filter(term => 
          api.description.toLowerCase().includes(term)
        ).length;
        const tagScore = searchTerms.filter(term => 
          api.tags.some(tag => tag.toLowerCase().includes(term))
        ).length;
        
        const totalScore = titleScore * 3 + descriptionScore * 2 + tagScore * 2;
        
        return { api, score: totalScore };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.api);
  }

  public createInteractiveTutorial(tutorialData: Omit<InteractiveTutorial, 'id' | 'progress' | 'startedAt' | 'completedAt'>): InteractiveTutorial {
    const tutorialId = this.generateId();
    
    const tutorial: InteractiveTutorial = {
      ...tutorialData,
      id: tutorialId,
      progress: 0
    };

    this.interactiveTutorials.set(tutorialId, tutorial);
    return tutorial;
  }

  public getInteractiveTutorial(tutorialId: string): InteractiveTutorial | null {
    return this.interactiveTutorials.get(tutorialId) || null;
  }

  public getAllInteractiveTutorials(): InteractiveTutorial[] {
    return Array.from(this.interactiveTutorials.values());
  }

  public updateTutorialProgress(tutorialId: string, stepId: string, completed: boolean): boolean {
    const tutorial = this.interactiveTutorials.get(tutorialId);
    if (!tutorial) return false;

    const updatedSteps = tutorial.steps.map(step => 
      step.id === stepId ? { ...step, completed } : step
    );

    const completedSteps = updatedSteps.filter(step => step.completed).length;
    const progress = (completedSteps / updatedSteps.length) * 100;

    const updatedTutorial: InteractiveTutorial = {
      ...tutorial,
      steps: updatedSteps,
      progress,
      startedAt: tutorial.startedAt || new Date(),
      completedAt: progress === 100 ? new Date() : tutorial.completedAt
    };

    this.interactiveTutorials.set(tutorialId, updatedTutorial);
    return true;
  }

  public createVideoTutorial(videoData: Omit<VideoTutorial, 'id' | 'createdAt' | 'viewCount' | 'likeCount' | 'dislikeCount' | 'relatedVideos' | 'subtitles'>): VideoTutorial {
    const videoId = this.generateId();
    const now = new Date();
    
    const video: VideoTutorial = {
      ...videoData,
      id: videoId,
      createdAt: now,
      publishedAt: now,
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      relatedVideos: [],
      subtitles: []
    };

    this.videoTutorials.set(videoId, video);
    return video;
  }

  public getVideoTutorial(videoId: string): VideoTutorial | null {
    return this.videoTutorials.get(videoId) || null;
  }

  public getAllVideoTutorials(): VideoTutorial[] {
    return Array.from(this.videoTutorials.values());
  }

  public incrementVideoViews(videoId: string): void {
    const video = this.videoTutorials.get(videoId);
    if (video) {
      this.videoTutorials.set(videoId, {
        ...video,
        viewCount: video.viewCount + 1
      });
    }
  }

  public createCertificationProgram(programData: Omit<CertificationProgram, 'id' | 'enrolledUsers' | 'completedUsers' | 'averageScore' | 'completionRate'>): CertificationProgram {
    const programId = this.generateId();
    
    const program: CertificationProgram = {
      ...programData,
      id: programId,
      enrolledUsers: [],
      completedUsers: [],
      averageScore: 0,
      completionRate: 0
    };

    this.certificationPrograms.set(programId, program);
    return program;
  }

  public getCertificationProgram(programId: string): CertificationProgram | null {
    return this.certificationPrograms.get(programId) || null;
  }

  public getAllCertificationPrograms(): CertificationProgram[] {
    return Array.from(this.certificationPrograms.values());
  }

  public enrollInCertification(programId: string, userId: string): boolean {
    const program = this.certificationPrograms.get(programId);
    if (!program) return false;

    if (!program.enrolledUsers.includes(userId)) {
      this.certificationPrograms.set(programId, {
        ...program,
        enrolledUsers: [...program.enrolledUsers, userId]
      });
    }

    return true;
  }

  public getDocumentationAnalytics(): {
    totalArticles: number;
    totalViews: number;
    averageHelpfulScore: number;
    mostViewedArticles: DocumentationArticle[];
    searchQueries: number;
    tutorialCompletions: number;
    certificationEnrollments: number;
  } {
    const articles = Array.from(this.articles.values());
    const tutorials = Array.from(this.interactiveTutorials.values());
    const programs = Array.from(this.certificationPrograms.values());

    const totalArticles = articles.length;
    const totalViews = articles.reduce((sum, article) => sum + article.viewCount, 0);
    
    const helpfulScores = articles.map(article => 
      article.helpfulCount / (article.helpfulCount + article.notHelpfulCount)
    ).filter(score => !isNaN(score));
    const averageHelpfulScore = helpfulScores.length > 0 ? 
      helpfulScores.reduce((a, b) => a + b, 0) / helpfulScores.length : 0;
    
    const mostViewedArticles = articles
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5);
    
    const tutorialCompletions = tutorials.filter(t => t.progress === 100).length;
    const certificationEnrollments = programs.reduce((sum, program) => sum + program.enrolledUsers.length, 0);

    return {
      totalArticles,
      totalViews,
      averageHelpfulScore,
      mostViewedArticles,
      searchQueries: Math.floor(totalViews * 0.3), // Estimate
      tutorialCompletions,
      certificationEnrollments
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const documentationService = new DocumentationService();
export default documentationService; 