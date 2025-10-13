import { analyticsService, AnalyticsEventType } from '../analytics/AnalyticsService';
import seoService from '../seo/SEOService';

// Content Types
export enum ContentType {
  BLOG_POST = 'blog_post',
  DOCUMENTATION = 'documentation',
  TUTORIAL = 'tutorial',
  CASE_STUDY = 'case_study',
  VIDEO = 'video',
  FAQ = 'faq',
  GUIDE = 'guide',
  NEWS = 'news'
}

// Content Status
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
  REVIEW = 'review'
}

// Content Category
export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  children?: ContentCategory[];
  seoKeywords: string[];
  color?: string;
  icon?: string;
}

// Content Author
export interface ContentAuthor {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  expertise: string[];
  publishedPosts: number;
}

// Content Post
export interface ContentPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: ContentType;
  status: ContentStatus;
  authorId: string;
  categoryId: string;
  tags: string[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
    schemaMarkup?: string;
  };
  publishDate: Date;
  lastModified: Date;
  featuredImage?: string;
  readingTime: number;
  wordCount: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  seoScore: number;
  performance: {
    pageSpeed: number;
    coreWebVitals: {
      LCP: number;
      FID: number;
      CLS: number;
    };
    mobileUsability: number;
  };
  metadata: Record<string, any>;
}

// Content Analytics
export interface ContentAnalytics {
  postId: string;
  views: number;
  uniqueViews: number;
  timeOnPage: number;
  bounceRate: number;
  socialShares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    total: number;
  };
  engagement: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  seoMetrics: {
    organicTraffic: number;
    searchRankings: Array<{
      keyword: string;
      position: number;
    }>;
    backlinks: number;
  };
  conversionMetrics: {
    leads: number;
    conversions: number;
    conversionRate: number;
  };
}

// Content Management Service
export class ContentManagementService {
  private posts: Map<string, ContentPost> = new Map();
  private categories: Map<string, ContentCategory> = new Map();
  private authors: Map<string, ContentAuthor> = new Map();
  private analytics: Map<string, ContentAnalytics> = new Map();

  constructor() {
    this.initialize();
  }

  // Initialize content management service
  private initialize(): void {
    this.setupDefaultCategories();
    this.setupDefaultAuthors();
    this.setupDefaultPosts();
    this.setupEventListeners();
  }

  // Setup default categories
  private setupDefaultCategories(): void {
    const defaultCategories: ContentCategory[] = [
      {
        id: 'ai-trends',
        name: 'AI Trends',
        slug: 'ai-trends',
        description: 'Latest trends and developments in artificial intelligence',
        seoKeywords: ['AI trends', 'artificial intelligence', 'machine learning', 'AI news'],
        color: '#3B82F6',
        icon: ''
      },
      {
        id: 'chatbot-tips',
        name: 'Chatbot Tips',
        slug: 'chatbot-tips',
        description: 'Tips and best practices for chatbot development',
        seoKeywords: ['chatbot tips', 'chatbot best practices', 'chatbot development'],
        color: '#10B981',
        icon: '💬'
      },
      {
        id: 'tutorials',
        name: 'Tutorials',
        slug: 'tutorials',
        description: 'Step-by-step tutorials and guides',
        seoKeywords: ['tutorials', 'guides', 'how-to', 'step-by-step'],
        color: '#F59E0B',
        icon: '📚'
      },
      {
        id: 'case-studies',
        name: 'Case Studies',
        slug: 'case-studies',
        description: 'Real-world case studies and success stories',
        seoKeywords: ['case studies', 'success stories', 'customer stories'],
        color: '#8B5CF6',
        icon: ''
      },
      {
        id: 'news',
        name: 'News',
        slug: 'news',
        description: 'Latest news and updates',
        seoKeywords: ['news', 'updates', 'announcements'],
        color: '#EF4444',
        icon: '📰'
      }
    ];

    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  // Setup default authors
  private setupDefaultAuthors(): void {
    const defaultAuthors: ContentAuthor[] = [
      {
        id: 'admin',
        name: 'AI Orchestrator Team',
        email: 'team@aiorchestrator.com',
        bio: 'The official AI Orchestrator team sharing insights about AI, chatbots, and digital transformation.',
        avatar: '/images/authors/team.jpg',
        socialLinks: {
          twitter: 'https://twitter.com/aiorchestrator',
          linkedin: 'https://linkedin.com/company/aiorchestrator',
          github: 'https://github.com/aiorchestrator'
        },
        expertise: ['AI', 'Chatbots', 'Machine Learning', 'Digital Transformation'],
        publishedPosts: 0
      },
      {
        id: 'expert-1',
        name: 'Dr. Sarah Chen',
        email: 'sarah@aiorchestrator.com',
        bio: 'AI Research Lead with 10+ years of experience in machine learning and natural language processing.',
        avatar: '/images/authors/sarah.jpg',
        socialLinks: {
          twitter: 'https://twitter.com/sarahchen',
          linkedin: 'https://linkedin.com/in/sarahchen'
        },
        expertise: ['Machine Learning', 'NLP', 'AI Research', 'Data Science'],
        publishedPosts: 0
      },
      {
        id: 'expert-2',
        name: 'Marcus Rodriguez',
        email: 'marcus@aiorchestrator.com',
        bio: 'Product Manager specializing in chatbot solutions and customer experience optimization.',
        avatar: '/images/authors/marcus.jpg',
        socialLinks: {
          twitter: 'https://twitter.com/marcusrodriguez',
          linkedin: 'https://linkedin.com/in/marcusrodriguez'
        },
        expertise: ['Product Management', 'Customer Experience', 'Chatbots', 'UX Design'],
        publishedPosts: 0
      }
    ];

    defaultAuthors.forEach(author => {
      this.authors.set(author.id, author);
    });
  }

  // Setup default posts
  private setupDefaultPosts(): void {
    const defaultPosts: Omit<ContentPost, 'id' | 'publishDate' | 'lastModified'>[] = [
      {
        title: 'The Future of AI-Powered Chatbots in 2024',
        slug: 'future-ai-chatbots-2024',
        excerpt: 'Discover the latest trends and innovations in AI-powered chatbots that will shape the industry in 2024.',
        content: `
# The Future of AI-Powered Chatbots in 2024

Artificial Intelligence has revolutionized the way businesses interact with their customers. As we move into 2024, AI-powered chatbots are becoming more sophisticated, intelligent, and essential for business success.

## Key Trends in 2024

### 1. Multimodal AI
Modern chatbots are evolving beyond text to support voice, images, and even video interactions. This multimodal approach provides a more natural and engaging user experience.

### 2. Emotional Intelligence
AI chatbots are now capable of understanding and responding to human emotions, making interactions more personalized and empathetic.

### 3. Predictive Analytics
Advanced chatbots can predict user needs and provide proactive assistance, improving customer satisfaction and engagement.

## Benefits for Businesses

- **24/7 Customer Support**: Round-the-clock assistance without human intervention
- **Cost Reduction**: Significant savings on customer service operations
- **Improved Efficiency**: Faster response times and higher resolution rates
- **Scalability**: Handle unlimited customer interactions simultaneously

## Implementation Strategies

1. **Start Small**: Begin with simple use cases and gradually expand
2. **Focus on User Experience**: Design intuitive and helpful interactions
3. **Continuous Learning**: Regularly update and improve your chatbot
4. **Integration**: Seamlessly integrate with existing business systems

The future of AI-powered chatbots is bright, and businesses that embrace this technology will have a significant competitive advantage.
        `,
        type: ContentType.BLOG_POST,
        status: ContentStatus.PUBLISHED,
        authorId: 'admin',
        categoryId: 'ai-trends',
        tags: ['AI', 'Chatbots', '2024', 'Trends', 'Technology'],
        seoData: {
          title: 'The Future of AI-Powered Chatbots in 2024 | AI Orchestrator',
          description: 'Discover the latest trends and innovations in AI-powered chatbots that will shape the industry in 2024.',
          keywords: ['AI chatbots', 'chatbot trends 2024', 'artificial intelligence', 'customer service AI'],
          ogImage: '/images/blog/future-ai-chatbots-2024.jpg'
        },
        featuredImage: '/images/blog/future-ai-chatbots-2024.jpg',
        readingTime: 5,
        wordCount: 250,
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        seoScore: 0,
        performance: {
          pageSpeed: 0,
          coreWebVitals: {
            LCP: 0,
            FID: 0,
            CLS: 0
          },
          mobileUsability: 0
        },
        metadata: {}
      },
      {
        title: '10 Essential Tips for Building Effective Chatbots',
        slug: '10-essential-chatbot-tips',
        excerpt: 'Learn the fundamental principles and best practices for creating chatbots that truly serve your customers.',
        content: `
# 10 Essential Tips for Building Effective Chatbots

Building an effective chatbot requires careful planning, design, and implementation. Here are 10 essential tips to help you create a chatbot that delivers real value to your users.

## 1. Define Clear Objectives

Before building your chatbot, clearly define what you want it to accomplish. Set specific, measurable goals that align with your business objectives.

## 2. Understand Your Users

Research your target audience to understand their needs, preferences, and pain points. Design your chatbot to address their specific requirements.

## 3. Keep Conversations Natural

Use natural language processing to create conversational experiences that feel human-like and engaging.

## 4. Provide Clear Options

Offer users clear choices and navigation options to help them find what they're looking for quickly.

## 5. Handle Errors Gracefully

Design your chatbot to handle unexpected inputs and errors in a helpful, non-frustrating way.

## 6. Test Thoroughly

Conduct extensive testing with real users to identify and fix issues before launch.

## 7. Monitor Performance

Track key metrics like response time, resolution rate, and user satisfaction to continuously improve.

## 8. Integrate with Existing Systems

Ensure your chatbot integrates seamlessly with your existing business systems and workflows.

## 9. Provide Human Escalation

Offer users the option to speak with a human agent when the chatbot can't help.

## 10. Continuously Improve

Regularly update and improve your chatbot based on user feedback and performance data.

By following these tips, you'll be well on your way to building a chatbot that provides real value to your customers and business.
        `,
        type: ContentType.BLOG_POST,
        status: ContentStatus.PUBLISHED,
        authorId: 'expert-2',
        categoryId: 'chatbot-tips',
        tags: ['Chatbot Tips', 'Best Practices', 'Design', 'User Experience'],
        seoData: {
          title: '10 Essential Tips for Building Effective Chatbots | AI Orchestrator',
          description: 'Learn the fundamental principles and best practices for creating chatbots that truly serve your customers.',
          keywords: ['chatbot tips', 'chatbot best practices', 'chatbot design', 'user experience'],
          ogImage: '/images/blog/chatbot-tips.jpg'
        },
        featuredImage: '/images/blog/chatbot-tips.jpg',
        readingTime: 8,
        wordCount: 400,
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        seoScore: 0,
        performance: {
          pageSpeed: 0,
          coreWebVitals: {
            LCP: 0,
            FID: 0,
            CLS: 0
          },
          mobileUsability: 0
        },
        metadata: {}
      }
    ];

    defaultPosts.forEach((post, index) => {
      const now = new Date();
      const publishDate = new Date(now.getTime() - (index * 24 * 60 * 60 * 1000)); // Stagger publish dates
      
      const fullPost: ContentPost = {
        ...post,
        id: this.generateId(),
        publishDate,
        lastModified: publishDate
      };

      this.posts.set(fullPost.id, fullPost);
      this.updateAuthorPostCount(fullPost.authorId);
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to page view events for content analytics
    analyticsService.on('event', (event: any) => {
      if (event.type === AnalyticsEventType.PAGE_VIEWED) {
        this.trackContentView(event);
      }
    });
  }

  // Track content view
  private trackContentView(event: any): void {
    const url = event.properties?.url || window.location.pathname;
    const postId = this.getPostIdFromUrl(url);
    
    if (postId) {
      this.incrementPostViews(postId);
      
      // Track with analytics
      analyticsService.track('content_view', {
        postId,
        url,
        title: event.properties?.title,
        category: event.properties?.category
      });
    }
  }

  // Get post ID from URL
  private getPostIdFromUrl(url: string): string | null {
    const posts = Array.from(this.posts.values());
    const post = posts.find(p => url.includes(p.slug));
    return post?.id || null;
  }

  // Increment post views
  private incrementPostViews(postId: string): void {
    const post = this.posts.get(postId);
    if (post) {
      post.views += 1;
    }

    // Update analytics
    const analytics = this.analytics.get(postId);
    if (analytics) {
      analytics.views += 1;
    }
  }

  // Update author post count
  private updateAuthorPostCount(authorId: string): void {
    const author = this.authors.get(authorId);
    if (author) {
      author.publishedPosts += 1;
    }
  }

  // Create new content post
  public createPost(postData: Omit<ContentPost, 'id' | 'publishDate' | 'lastModified' | 'views' | 'likes' | 'shares' | 'comments' | 'seoScore' | 'performance'>): ContentPost {
    const now = new Date();
    const post: ContentPost = {
      ...postData,
      id: this.generateId(),
      publishDate: postData.status === ContentStatus.PUBLISHED ? now : new Date(0),
      lastModified: now,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      seoScore: 0,
      performance: {
        pageSpeed: 0,
        coreWebVitals: {
          LCP: 0,
          FID: 0,
          CLS: 0
        },
        mobileUsability: 0
      }
    };

    this.posts.set(post.id, post);
    this.updateAuthorPostCount(post.authorId);
    this.initializePostAnalytics(post.id);
    this.updateSEOData(post);

    return post;
  }

  // Initialize post analytics
  private initializePostAnalytics(postId: string): void {
    const analytics: ContentAnalytics = {
      postId,
      views: 0,
      uniqueViews: 0,
      timeOnPage: 0,
      bounceRate: 0,
      socialShares: {
        facebook: 0,
        twitter: 0,
        linkedin: 0,
        total: 0
      },
      engagement: {
        likes: 0,
        comments: 0,
        bookmarks: 0
      },
      seoMetrics: {
        organicTraffic: 0,
        searchRankings: [],
        backlinks: 0
      },
      conversionMetrics: {
        leads: 0,
        conversions: 0,
        conversionRate: 0
      }
    };

    this.analytics.set(postId, analytics);
  }

  // Update SEO data
  private updateSEOData(post: ContentPost): void {
    const url = `/blog/${post.slug}`;
    seoService.setSEOPageData(url, {
      url,
      title: post.seoData.title,
      description: post.seoData.description,
      keywords: post.seoData.keywords,
      canonicalUrl: post.seoData.canonicalUrl,
      ogTitle: post.seoData.title,
      ogDescription: post.seoData.description,
      ogImage: post.seoData.ogImage,
      twitterCard: 'summary_large_image',
      twitterTitle: post.seoData.title,
      twitterDescription: post.seoData.description,
      twitterImage: post.seoData.ogImage,
      schemaMarkup: this.generateArticleSchema(post),
      h1: post.title,
      h2: this.extractHeadings(post.content, 2),
      h3: this.extractHeadings(post.content, 3),
      images: [],
      links: [],
      metaTags: {}
    });
  }

  // Generate article schema
  private generateArticleSchema(post: ContentPost): string {
    const author = this.authors.get(post.authorId);
    const category = this.categories.get(post.categoryId);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.seoData.description,
      "image": post.seoData.ogImage,
      "author": {
        "@type": "Person",
        "name": author?.name || "AI Orchestrator Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Orchestrator",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aiorchestrator.com/logo.png"
        }
      },
      "datePublished": post.publishDate.toISOString(),
      "dateModified": post.lastModified.toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://aiorchestrator.com/blog/${post.slug}`
      },
      "articleSection": category?.name || "Blog"
    };

    return JSON.stringify(schema);
  }

  // Extract headings from content
  private extractHeadings(content: string, level: number): string[] {
    const regex = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
    const matches = content.match(regex);
    return matches ? matches.map(match => match.replace(`#${'#'.repeat(level)} `, '')) : [];
  }

  // Get post by ID
  public getPost(postId: string): ContentPost | null {
    return this.posts.get(postId) || null;
  }

  // Get post by slug
  public getPostBySlug(slug: string): ContentPost | null {
    const posts = Array.from(this.posts.values());
    return posts.find(post => post.slug === slug) || null;
  }

  // Get all posts
  public getAllPosts(
    status?: ContentStatus,
    type?: ContentType,
    categoryId?: string,
    authorId?: string
  ): ContentPost[] {
    let posts = Array.from(this.posts.values());

    if (status) {
      posts = posts.filter(post => post.status === status);
    }

    if (type) {
      posts = posts.filter(post => post.type === type);
    }

    if (categoryId) {
      posts = posts.filter(post => post.categoryId === categoryId);
    }

    if (authorId) {
      posts = posts.filter(post => post.authorId === authorId);
    }

    return posts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  // Get published posts
  public getPublishedPosts(limit?: number): ContentPost[] {
    const posts = this.getAllPosts(ContentStatus.PUBLISHED);
    return limit ? posts.slice(0, limit) : posts;
  }

  // Update post
  public updatePost(postId: string, updates: Partial<ContentPost>): ContentPost | null {
    const post = this.posts.get(postId);
    if (!post) return null;

    const updatedPost: ContentPost = {
      ...post,
      ...updates,
      lastModified: new Date()
    };

    this.posts.set(postId, updatedPost);
    this.updateSEOData(updatedPost);

    return updatedPost;
  }

  // Delete post
  public deletePost(postId: string): boolean {
    const post = this.posts.get(postId);
    if (!post) return false;

    this.posts.delete(postId);
    this.analytics.delete(postId);

    // Update author post count
    const author = this.authors.get(post.authorId);
    if (author) {
      author.publishedPosts = Math.max(0, author.publishedPosts - 1);
    }

    return true;
  }

  // Get categories
  public getCategories(): ContentCategory[] {
    return Array.from(this.categories.values());
  }

  // Get category by ID
  public getCategory(categoryId: string): ContentCategory | null {
    return this.categories.get(categoryId) || null;
  }

  // Create category
  public createCategory(category: Omit<ContentCategory, 'id'>): ContentCategory {
    const newCategory: ContentCategory = {
      ...category,
      id: this.generateId()
    };

    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  // Get authors
  public getAuthors(): ContentAuthor[] {
    return Array.from(this.authors.values());
  }

  // Get author by ID
  public getAuthor(authorId: string): ContentAuthor | null {
    return this.authors.get(authorId) || null;
  }

  // Create author
  public createAuthor(author: Omit<ContentAuthor, 'id' | 'publishedPosts'>): ContentAuthor {
    const newAuthor: ContentAuthor = {
      ...author,
      id: this.generateId(),
      publishedPosts: 0
    };

    this.authors.set(newAuthor.id, newAuthor);
    return newAuthor;
  }

  // Get post analytics
  public getPostAnalytics(postId: string): ContentAnalytics | null {
    return this.analytics.get(postId) || null;
  }

  // Track post engagement
  public trackPostEngagement(
    postId: string,
    type: 'like' | 'share' | 'comment' | 'bookmark',
    platform?: string
  ): void {
    const post = this.posts.get(postId);
    const analytics = this.analytics.get(postId);

    if (post && analytics) {
      switch (type) {
        case 'like':
          post.likes += 1;
          analytics.engagement.likes += 1;
          break;
        case 'share':
          post.shares += 1;
          analytics.socialShares.total += 1;
          if (platform) {
            analytics.socialShares[platform as keyof typeof analytics.socialShares] += 1;
          }
          break;
        case 'comment':
          post.comments += 1;
          analytics.engagement.comments += 1;
          break;
        case 'bookmark':
          analytics.engagement.bookmarks += 1;
          break;
      }
    }

    // Track with analytics
    analyticsService.track('content_engagement', {
      postId,
      type,
      platform
    });
  }

  // Search posts
  public searchPosts(query: string): ContentPost[] {
    const posts = Array.from(this.posts.values());
    const searchTerm = query.toLowerCase();

    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Get related posts
  public getRelatedPosts(postId: string, limit: number = 3): ContentPost[] {
    const post = this.posts.get(postId);
    if (!post) return [];

    const posts = Array.from(this.posts.values()).filter(p => p.id !== postId);
    
    // Score posts based on similarity
    const scoredPosts = posts.map(p => {
      let score = 0;
      
      // Same category
      if (p.categoryId === post.categoryId) score += 3;
      
      // Same author
      if (p.authorId === post.authorId) score += 2;
      
      // Common tags
      const commonTags = post.tags.filter(tag => p.tags.includes(tag));
      score += commonTags.length;
      
      return { post: p, score };
    });

    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const contentManagementService = new ContentManagementService();

// Export default instance
export default contentManagementService; 