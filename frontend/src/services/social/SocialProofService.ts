import { analyticsService } from '../analytics/AnalyticsService';

// Social Proof Types
export enum ReviewType {
  CUSTOMER = 'customer',
  PARTNER = 'partner',
  EXPERT = 'expert',
  VERIFIED = 'verified'
}

export enum TestimonialType {
  VIDEO = 'video',
  TEXT = 'text',
  AUDIO = 'audio',
  CASE_STUDY = 'case_study'
}

export enum TrustBadgeType {
  SECURITY = 'security',
  CERTIFICATION = 'certification',
  AWARD = 'award',
  PARTNERSHIP = 'partnership',
  GUARANTEE = 'guarantee'
}

export enum CommunityType {
  FORUM = 'forum',
  DISCORD = 'discord',
  SLACK = 'slack',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin'
}

// Review
export interface Review {
  id: string;
  type: ReviewType;
  author: {
    name: string;
    email: string;
    avatar?: string;
    company?: string;
    position?: string;
    location?: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  tags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: Date;
  updatedAt: Date;
  helpful: number;
  notHelpful: number;
  replies: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: Date;
  }>;
  metadata: Record<string, any>;
}

// Testimonial
export interface Testimonial {
  id: string;
  type: TestimonialType;
  author: {
    name: string;
    title: string;
    company: string;
    avatar: string;
    linkedin?: string;
    twitter?: string;
  };
  content: string;
  videoUrl?: string;
  audioUrl?: string;
  featured: boolean;
  category: string;
  tags: string[];
  metrics: {
    views: number;
    shares: number;
    conversions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Trust Badge
export interface TrustBadge {
  id: string;
  type: TrustBadgeType;
  name: string;
  description: string;
  icon: string;
  image: string;
  url?: string;
  verificationUrl?: string;
  issuedBy: string;
  issuedDate: Date;
  expiresDate?: Date;
  isActive: boolean;
  displayOrder: number;
  metadata: Record<string, any>;
}

// Community
export interface Community {
  id: string;
  type: CommunityType;
  name: string;
  description: string;
  url: string;
  memberCount: number;
  isActive: boolean;
  features: string[];
  rules: string[];
  moderators: string[];
  createdAt: Date;
  updatedAt: Date;
}

// User-Generated Content
export interface UserGeneratedContent {
  id: string;
  type: 'post' | 'comment' | 'review' | 'tutorial' | 'case_study';
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  content: string;
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  }>;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Community Post
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  communityId: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Social Proof Service
export class SocialProofService {
  private reviews: Map<string, Review> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();
  private trustBadges: Map<string, TrustBadge> = new Map();
  private communities: Map<string, Community> = new Map();
  private userGeneratedContent: Map<string, UserGeneratedContent> = new Map();


  constructor() {
    this.initialize();
  }

  // Initialize social proof service
  private initialize(): void {
    this.setupDefaultReviews();
    this.setupDefaultTestimonials();
    this.setupDefaultTrustBadges();
    this.setupDefaultCommunities();
    this.setupDefaultUserGeneratedContent();
    this.setupEventListeners();
  }

  // Setup default reviews
  private setupDefaultReviews(): void {
    const defaultReviews: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: ReviewType.VERIFIED,
        author: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@techcorp.com',
          avatar: '/images/reviews/sarah.jpg',
          company: 'TechCorp Solutions',
          position: 'CTO',
          location: 'San Francisco, CA',
          verified: true
        },
        rating: 5,
        title: 'Game-changing AI platform for our customer service',
        content: 'AI Orchestrator has completely transformed our customer service operations. The chatbot handles 80% of our inquiries automatically, reducing response times from hours to seconds. The AI is incredibly intelligent and learns from every interaction.',
        pros: ['Easy to set up', 'Excellent AI capabilities', 'Great analytics', '24/7 support'],
        cons: ['Learning curve for advanced features'],
        tags: ['customer-service', 'ai', 'automation', 'efficiency'],
        status: 'approved',
        helpful: 24,
        notHelpful: 1,
        replies: [],
        metadata: {}
      },
      {
        type: ReviewType.VERIFIED,
        author: {
          name: 'Michael Chen',
          email: 'michael.chen@startup.io',
          avatar: '/images/reviews/michael.jpg',
          company: 'Startup.io',
          position: 'Founder',
          location: 'New York, NY',
          verified: true
        },
        rating: 5,
        title: 'Perfect for startups - scales with your business',
        content: 'As a startup, we needed a solution that could grow with us. AI Orchestrator delivered exactly that. Started with basic chatbot functionality and now we have advanced AI features that our enterprise clients love.',
        pros: ['Scalable', 'Cost-effective', 'Feature-rich', 'Great support'],
        cons: ['Could use more templates'],
        tags: ['startup', 'scalable', 'cost-effective', 'enterprise'],
        status: 'approved',
        helpful: 18,
        notHelpful: 0,
        replies: [],
        metadata: {}
      },
      {
        type: ReviewType.CUSTOMER,
        author: {
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@retail.com',
          avatar: '/images/reviews/emily.jpg',
          company: 'Retail Plus',
          position: 'E-commerce Manager',
          location: 'Miami, FL',
          verified: true
        },
        rating: 4,
        title: 'Excellent for e-commerce customer support',
        content: 'The integration with our e-commerce platform was seamless. Our customers love the instant responses and the chatbot handles product inquiries, order tracking, and returns efficiently.',
        pros: ['E-commerce integration', 'Fast responses', 'Multi-language support'],
        cons: ['Limited payment processing features'],
        tags: ['e-commerce', 'customer-support', 'integration'],
        status: 'approved',
        helpful: 15,
        notHelpful: 2,
        replies: [],
        metadata: {}
      }
    ];

    defaultReviews.forEach((review, index) => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - (index * 7 * 24 * 60 * 60 * 1000)); // Stagger dates
      
      const fullReview: Review = {
        ...review,
        id: this.generateId(),
        createdAt,
        updatedAt: createdAt
      };

      this.reviews.set(fullReview.id, fullReview);
    });
  }

  // Setup default testimonials
  private setupDefaultTestimonials(): void {
    const defaultTestimonials: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: TestimonialType.VIDEO,
        author: {
          name: 'David Kim',
          title: 'VP of Operations',
          company: 'Global Enterprises',
          avatar: '/images/testimonials/david.jpg',
          linkedin: 'https://linkedin.com/in/davidkim'
        },
        content: 'AI Orchestrator helped us reduce customer service costs by 60% while improving customer satisfaction scores. The ROI was immediate and continues to grow.',
        videoUrl: 'https://youtube.com/watch?v=testimonial1',
        featured: true,
        category: 'enterprise',
        tags: ['cost-reduction', 'customer-satisfaction', 'roi'],
        metrics: {
          views: 1250,
          shares: 89,
          conversions: 23
        }
      },
      {
        type: TestimonialType.TEXT,
        author: {
          name: 'Lisa Wang',
          title: 'Head of Customer Experience',
          company: 'Innovation Labs',
          avatar: '/images/testimonials/lisa.jpg',
          twitter: '@lisawang'
        },
        content: 'The AI capabilities are mind-blowing. Our chatbot understands context, remembers conversations, and provides personalized responses. Our customers think they\'re talking to a human!',
        featured: true,
        category: 'ai-capabilities',
        tags: ['ai', 'personalization', 'customer-experience'],
        metrics: {
          views: 890,
          shares: 45,
          conversions: 12
        }
      },
      {
        type: TestimonialType.CASE_STUDY,
        author: {
          name: 'Robert Martinez',
          title: 'CEO',
          company: 'ScaleUp Solutions',
          avatar: '/images/testimonials/robert.jpg'
        },
        content: 'We implemented AI Orchestrator across our entire customer service team. The results were incredible - 90% faster response times, 75% reduction in support tickets, and 40% increase in customer satisfaction.',
        featured: false,
        category: 'case-study',
        tags: ['implementation', 'metrics', 'customer-service'],
        metrics: {
          views: 567,
          shares: 23,
          conversions: 8
        }
      }
    ];

    defaultTestimonials.forEach((testimonial, index) => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - (index * 14 * 24 * 60 * 60 * 1000)); // Stagger dates
      
      const fullTestimonial: Testimonial = {
        ...testimonial,
        id: this.generateId(),
        createdAt,
        updatedAt: createdAt
      };

      this.testimonials.set(fullTestimonial.id, fullTestimonial);
    });
  }

  // Setup default trust badges
  private setupDefaultTrustBadges(): void {
    const defaultBadges: Omit<TrustBadge, 'id' | 'issuedDate'>[] = [
      {
        type: TrustBadgeType.SECURITY,
        name: 'SOC 2 Type II Certified',
        description: 'Our platform meets the highest security standards for data protection and privacy',
        icon: '',
        image: '/images/badges/soc2.png',
        verificationUrl: 'https://trust.aiorchestrator.com/soc2',
        issuedBy: 'AICPA',
        expiresDate: new Date('2025-12-31'),
        isActive: true,
        displayOrder: 1,
        metadata: {}
      },
      {
        type: TrustBadgeType.SECURITY,
        name: 'GDPR Compliant',
        description: 'Full compliance with European data protection regulations',
        icon: '🛡️',
        image: '/images/badges/gdpr.png',
        verificationUrl: 'https://trust.aiorchestrator.com/gdpr',
        issuedBy: 'EU Commission',
        isActive: true,
        displayOrder: 2,
        metadata: {}
      },
      {
        type: TrustBadgeType.CERTIFICATION,
        name: 'ISO 27001 Certified',
        description: 'Information security management system certification',
        icon: '🏆',
        image: '/images/badges/iso27001.png',
        verificationUrl: 'https://trust.aiorchestrator.com/iso27001',
        issuedBy: 'ISO',
        expiresDate: new Date('2024-12-31'),
        isActive: true,
        displayOrder: 3,
        metadata: {}
      },
      {
        type: TrustBadgeType.AWARD,
        name: 'Best AI Platform 2024',
        description: 'Recognized as the leading AI chatbot platform',
        icon: '',
        image: '/images/badges/best-ai-2024.png',
        url: 'https://awards.tech.com/best-ai-platform-2024',
        issuedBy: 'Tech Awards',
        isActive: true,
        displayOrder: 4,
        metadata: {}
      },
      {
        type: TrustBadgeType.GUARANTEE,
        name: '30-Day Money Back Guarantee',
        description: 'Try AI Orchestrator risk-free with our 30-day guarantee',
        icon: '💯',
        image: '/images/badges/money-back.png',
        issuedBy: 'AI Orchestrator',
        isActive: true,
        displayOrder: 5,
        metadata: {}
      }
    ];

    defaultBadges.forEach((badge, index) => {
      const issuedDate = new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)); // Stagger dates
      
      const fullBadge: TrustBadge = {
        ...badge,
        id: this.generateId(),
        issuedDate
      };

      this.trustBadges.set(fullBadge.id, fullBadge);
    });
  }

  // Setup default communities
  private setupDefaultCommunities(): void {
    const defaultCommunities: Omit<Community, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: CommunityType.DISCORD,
        name: 'AI Orchestrator Community',
        description: 'Join thousands of AI enthusiasts, developers, and business leaders',
        url: 'https://discord.gg/aiorchestrator',
        memberCount: 15420,
        isActive: true,
        features: ['Live chat', 'Voice channels', 'Resource sharing', 'Expert Q&A'],
        rules: [
          'Be respectful and inclusive',
          'No spam or self-promotion',
          'Share knowledge and help others',
          'Follow Discord community guidelines'
        ],
        moderators: ['admin1', 'mod1', 'mod2']
      },
      {
        type: CommunityType.FORUM,
        name: 'AI Orchestrator Forum',
        description: 'Official community forum for discussions, support, and feature requests',
        url: 'https://forum.aiorchestrator.com',
        memberCount: 8920,
        isActive: true,
        features: ['Discussion boards', 'Knowledge base', 'Feature requests', 'Bug reports'],
        rules: [
          'Search before posting',
          'Use appropriate categories',
          'Provide detailed information',
          'Be patient with responses'
        ],
        moderators: ['admin1', 'mod3', 'mod4']
      },
      {
        type: CommunityType.LINKEDIN,
        name: 'AI Orchestrator Professionals',
        description: 'Professional network for AI Orchestrator users and partners',
        url: 'https://linkedin.com/groups/aiorchestrator',
        memberCount: 5670,
        isActive: true,
        features: ['Professional networking', 'Industry insights', 'Job opportunities', 'Partner connections'],
        rules: [
          'Professional conduct only',
          'No sales pitches',
          'Share valuable insights',
          'Connect meaningfully'
        ],
        moderators: ['admin1', 'mod5']
      }
    ];

    defaultCommunities.forEach((community, index) => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - (index * 90 * 24 * 60 * 60 * 1000)); // Stagger dates
      
      const fullCommunity: Community = {
        ...community,
        id: this.generateId(),
        createdAt,
        updatedAt: createdAt
      };

      this.communities.set(fullCommunity.id, fullCommunity);
    });
  }

  // Setup default user-generated content
  private setupDefaultUserGeneratedContent(): void {
    const defaultContent: Omit<UserGeneratedContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: 'tutorial',
        author: {
          id: 'user1',
          name: 'Alex Thompson',
          avatar: '/images/users/alex.jpg',
          verified: true
        },
        title: 'How to Build a Customer Service Chatbot in 30 Minutes',
        content: 'I created this tutorial to help others get started quickly with AI Orchestrator. Follow these steps to build your first customer service chatbot...',
        media: [
          {
            type: 'video',
            url: 'https://youtube.com/watch?v=tutorial1',
            thumbnail: '/images/tutorials/customer-service-thumb.jpg'
          }
        ],
        tags: ['tutorial', 'customer-service', 'beginner'],
        status: 'approved',
        engagement: {
          likes: 156,
          comments: 23,
          shares: 45,
          views: 2340
        }
      },
      {
        type: 'case_study',
        author: {
          id: 'user2',
          name: 'Maria Garcia',
          avatar: '/images/users/maria.jpg',
          verified: true
        },
        title: 'How We Increased Sales by 200% with AI Orchestrator',
        content: 'Our e-commerce business was struggling with customer inquiries. After implementing AI Orchestrator, we saw incredible results...',
        tags: ['case-study', 'e-commerce', 'sales', 'success-story'],
        status: 'approved',
        engagement: {
          likes: 89,
          comments: 12,
          shares: 34,
          views: 1560
        }
      }
    ];

    defaultContent.forEach((content, index) => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - (index * 21 * 24 * 60 * 60 * 1000)); // Stagger dates
      
      const fullContent: UserGeneratedContent = {
        ...content,
        id: this.generateId(),
        createdAt,
        updatedAt: createdAt
      };

      this.userGeneratedContent.set(fullContent.id, fullContent);
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to social proof events
    analyticsService.on('event', (event: any) => {
      if (event.type === 'review_submitted') {
        this.handleReviewSubmitted(event);
              } else if (event.type === 'testimonial_viewed') {
        this.handleTestimonialViewed(event);
              } else if (event.type === 'trust_badge_clicked') {
        this.handleTrustBadgeClicked(event);
      }
    });
  }

  // Handle review submitted
  private handleReviewSubmitted(event: any): void {
    const reviewId = event.properties?.reviewId;
    const rating = event.properties?.rating;
    
    if (reviewId && rating) {
      this.trackReviewMetrics(reviewId, rating);
    }
  }

  // Handle testimonial viewed
  private handleTestimonialViewed(event: any): void {
    const testimonialId = event.properties?.testimonialId;
    
    if (testimonialId) {
      this.incrementTestimonialViews(testimonialId);
    }
  }

  // Handle trust badge clicked
  private handleTrustBadgeClicked(event: any): void {
    const badgeId = event.properties?.badgeId;
    
    if (badgeId) {
      this.trackTrustBadgeClick(badgeId);
    }
  }

  // Track review metrics
  private trackReviewMetrics(reviewId: string, rating: number): void {
    const review = this.reviews.get(reviewId);
    if (review) {
      // Update review analytics
      analyticsService.track('review_metrics', {
        reviewId,
        rating,
        author: review.author.name,
        company: review.author.company
      });
    }
  }

  // Increment testimonial views
  private incrementTestimonialViews(testimonialId: string): void {
    const testimonial = this.testimonials.get(testimonialId);
    if (testimonial) {
      testimonial.metrics.views += 1;
    }
  }

  // Track trust badge click
  private trackTrustBadgeClick(badgeId: string): void {
    const badge = this.trustBadges.get(badgeId);
    if (badge) {
      analyticsService.track('trust_badge_click', {
        badgeId,
        badgeName: badge.name,
        badgeType: badge.type
      });
    }
  }

  // Create review
  public createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'notHelpful' | 'replies'>): Review {
    const now = new Date();
    const review: Review = {
      ...reviewData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      helpful: 0,
      notHelpful: 0,
      replies: []
    };

    this.reviews.set(review.id, review);

    // Track with analytics
    analyticsService.track('review_created', {
      reviewId: review.id,
      rating: review.rating,
      type: review.type,
      author: review.author.name
    });

    return review;
  }

  // Get review
  public getReview(reviewId: string): Review | null {
    return this.reviews.get(reviewId) || null;
  }

  // Get all reviews
  public getReviews(
    type?: ReviewType,
    status?: string,
    rating?: number,
    limit?: number
  ): Review[] {
    let reviews = Array.from(this.reviews.values());

    if (type) {
      reviews = reviews.filter(review => review.type === type);
    }

    if (status) {
      reviews = reviews.filter(review => review.status === status);
    }

    if (rating) {
      reviews = reviews.filter(review => review.rating === rating);
    }

    reviews = reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return limit ? reviews.slice(0, limit) : reviews;
  }

  // Update review
  public updateReview(reviewId: string, updates: Partial<Review>): Review | null {
    const review = this.reviews.get(reviewId);
    if (!review) return null;

    const updatedReview: Review = {
      ...review,
      ...updates,
      updatedAt: new Date()
    };

    this.reviews.set(reviewId, updatedReview);
    return updatedReview;
  }

  // Mark review as helpful
  public markReviewHelpful(reviewId: string, helpful: boolean): boolean {
    const review = this.reviews.get(reviewId);
    if (!review) return false;

    if (helpful) {
      review.helpful += 1;
    } else {
      review.notHelpful += 1;
    }

    // Track with analytics
    analyticsService.track('review_helpful', {
      reviewId,
      helpful,
      author: review.author.name
    });

    return true;
  }

  // Add review reply
  public addReviewReply(reviewId: string, author: string, content: string): boolean {
    const review = this.reviews.get(reviewId);
    if (!review) return false;

    const reply = {
      id: this.generateId(),
      author,
      content,
      createdAt: new Date()
    };

    review.replies.push(reply);
    review.updatedAt = new Date();

    return true;
  }

  // Create testimonial
  public createTestimonial(testimonialData: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Testimonial {
    const now = new Date();
    const testimonial: Testimonial = {
      ...testimonialData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      metrics: {
        views: 0,
        shares: 0,
        conversions: 0
      }
    };

    this.testimonials.set(testimonial.id, testimonial);
    return testimonial;
  }

  // Create testimonial with simplified interface for components
  public createTestimonialSimple(data: {
    title: string;
    content: string;
    authorName: string;
    authorRole: string;
    company: string;
    rating: number;
    category: string;
  }): Testimonial {
    const now = new Date();
    const testimonial: Testimonial = {
      id: this.generateId(),
      type: TestimonialType.TEXT,
      author: {
        name: data.authorName,
        title: data.authorRole,
        company: data.company,
        avatar: '/images/default-avatar.png'
      },
      content: data.content,
      featured: false,
      category: data.category,
      tags: [],
      metrics: {
        views: 0,
        shares: 0,
        conversions: 0
      },
      createdAt: now,
      updatedAt: now
    };

    this.testimonials.set(testimonial.id, testimonial);
    return testimonial;
  }

  // Get testimonial
  public getTestimonial(testimonialId: string): Testimonial | null {
    return this.testimonials.get(testimonialId) || null;
  }

  // Get all testimonials
  public getTestimonials(
    type?: TestimonialType,
    featured?: boolean,
    category?: string,
    limit?: number
  ): Testimonial[] {
    let testimonials = Array.from(this.testimonials.values());

    if (type) {
      testimonials = testimonials.filter(testimonial => testimonial.type === type);
    }

    if (featured !== undefined) {
      testimonials = testimonials.filter(testimonial => testimonial.featured === featured);
    }

    if (category) {
      testimonials = testimonials.filter(testimonial => testimonial.category === category);
    }

    testimonials = testimonials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return limit ? testimonials.slice(0, limit) : testimonials;
  }

  // Get trust badges
  public getTrustBadges(type?: TrustBadgeType, active?: boolean): TrustBadge[] {
    let badges = Array.from(this.trustBadges.values());

    if (type) {
      badges = badges.filter(badge => badge.type === type);
    }

    if (active !== undefined) {
      badges = badges.filter(badge => badge.isActive === active);
    }

    return badges.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // Get communities
  public getCommunities(type?: CommunityType, active?: boolean): Community[] {
    let communities = Array.from(this.communities.values());

    if (type) {
      communities = communities.filter(community => community.type === type);
    }

    if (active !== undefined) {
      communities = communities.filter(community => community.isActive === active);
    }

    return communities.sort((a, b) => b.memberCount - a.memberCount);
  }

  // Get community posts
  public getCommunityPosts(): CommunityPost[] {
    return [
      {
        id: 'post-1',
        title: 'Getting Started with AI Orchestrator',
        content: 'Great platform for managing AI workflows!',
        tags: ['getting-started', 'tutorial'],
        communityId: 'community-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }

  // Create community post
  public createCommunityPost(data: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): CommunityPost {
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      title: data.title,
      content: data.content,
      tags: data.tags,
      communityId: data.communityId,
      authorId: data.authorId,
      authorName: data.authorName || 'Anonymous',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return post;
  }



  // Create user-generated content
  public createUserGeneratedContent(contentData: Omit<UserGeneratedContent, 'id' | 'createdAt' | 'updatedAt' | 'engagement'>): UserGeneratedContent {
    const now = new Date();
    const content: UserGeneratedContent = {
      ...contentData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      }
    };

    this.userGeneratedContent.set(content.id, content);

    // Track with analytics
    analyticsService.track('user_content_created', {
      contentId: content.id,
      type: content.type,
      author: content.author.name
    });

    return content;
  }

  // Get user-generated content
  public getUserGeneratedContent(
    type?: string,
    status?: string,
    limit?: number
  ): UserGeneratedContent[] {
    let content = Array.from(this.userGeneratedContent.values());

    if (type) {
      content = content.filter(item => item.type === type);
    }

    if (status) {
      content = content.filter(item => item.status === status);
    }

    content = content.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return limit ? content.slice(0, limit) : content;
  }

  // Track content engagement
  public trackContentEngagement(
    contentId: string,
    type: 'like' | 'comment' | 'share' | 'view'
  ): boolean {
    const content = this.userGeneratedContent.get(contentId);
    if (!content) return false;

    switch (type) {
      case 'like':
        content.engagement.likes += 1;
        break;
      case 'comment':
        content.engagement.comments += 1;
        break;
      case 'share':
        content.engagement.shares += 1;
        break;
      case 'view':
        content.engagement.views += 1;
        break;
    }

    content.updatedAt = new Date();

    // Track with analytics
    analyticsService.track('content_engagement', {
      contentId,
      type,
      author: content.author.name
    });

    return true;
  }

  // Get social proof analytics
  public getSocialProofAnalytics(): {
    reviewMetrics: {
      totalReviews: number;
      averageRating: number;
      verifiedReviews: number;
      recentReviews: number;
    };
    testimonialMetrics: {
      totalTestimonials: number;
      featuredTestimonials: number;
      totalViews: number;
      totalConversions: number;
    };
    trustMetrics: {
      activeBadges: number;
      totalClicks: number;
      verificationViews: number;
    };
    communityMetrics: {
      totalCommunities: number;
      totalMembers: number;
      activeCommunities: number;
    };
    contentMetrics: {
      totalContent: number;
      approvedContent: number;
      totalEngagement: number;
      averageEngagement: number;
    };
  } {
    const reviewMetrics = {
      totalReviews: 0,
      averageRating: 0,
      verifiedReviews: 0,
      recentReviews: 0
    };

    const testimonialMetrics = {
      totalTestimonials: 0,
      featuredTestimonials: 0,
      totalViews: 0,
      totalConversions: 0
    };

    const trustMetrics = {
      activeBadges: 0,
      totalClicks: 0,
      verificationViews: 0
    };

    const communityMetrics = {
      totalCommunities: 0,
      totalMembers: 0,
      activeCommunities: 0
    };

    const contentMetrics = {
      totalContent: 0,
      approvedContent: 0,
      totalEngagement: 0,
      averageEngagement: 0
    };

    // Calculate review metrics
    const reviews = Array.from(this.reviews.values());
    reviewMetrics.totalReviews = reviews.length;
    reviewMetrics.verifiedReviews = reviews.filter(r => r.author.verified).length;
    reviewMetrics.recentReviews = reviews.filter(r => {
      const daysAgo = (Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30;
    }).length;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      reviewMetrics.averageRating = totalRating / reviews.length;
    }

    // Calculate testimonial metrics
    const testimonials = Array.from(this.testimonials.values());
    testimonialMetrics.totalTestimonials = testimonials.length;
    testimonialMetrics.featuredTestimonials = testimonials.filter(t => t.featured).length;
    testimonialMetrics.totalViews = testimonials.reduce((sum, t) => sum + t.metrics.views, 0);
    testimonialMetrics.totalConversions = testimonials.reduce((sum, t) => sum + t.metrics.conversions, 0);

    // Calculate trust metrics
    const badges = Array.from(this.trustBadges.values());
    trustMetrics.activeBadges = badges.filter(b => b.isActive).length;

    // Calculate community metrics
    const communities = Array.from(this.communities.values());
    communityMetrics.totalCommunities = communities.length;
    communityMetrics.activeCommunities = communities.filter(c => c.isActive).length;
    communityMetrics.totalMembers = communities.reduce((sum, c) => sum + c.memberCount, 0);

    // Calculate content metrics
    const content = Array.from(this.userGeneratedContent.values());
    contentMetrics.totalContent = content.length;
    contentMetrics.approvedContent = content.filter(c => c.status === 'approved').length;
    contentMetrics.totalEngagement = content.reduce((sum, c) => 
      sum + c.engagement.likes + c.engagement.comments + c.engagement.shares, 0
    );

    if (content.length > 0) {
      contentMetrics.averageEngagement = contentMetrics.totalEngagement / content.length;
    }

    return {
      reviewMetrics,
      testimonialMetrics,
      trustMetrics,
      communityMetrics,
      contentMetrics
    };
  }

  // Get review statistics
  public getReviewStatistics(): {
    ratingDistribution: Record<number, number>;
    averageRating: number;
    totalReviews: number;
    recentReviews: number;
    topTags: Array<{ tag: string; count: number }>;
  } {
    const reviews = Array.from(this.reviews.values());
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const tagCounts: Record<string, number> = {};

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
      review.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    const recentReviews = reviews.filter(r => {
      const daysAgo = (Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30;
    }).length;

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      ratingDistribution,
      averageRating,
      totalReviews: reviews.length,
      recentReviews,
      topTags
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const socialProofService = new SocialProofService();

// Export default instance
export default socialProofService; 