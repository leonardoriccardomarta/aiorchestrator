import { analyticsService } from '../analytics/AnalyticsService';

// Growth Marketing Types
export enum GrowthChannel {
  REFERRAL = 'referral',
  EMAIL = 'email',
  SOCIAL = 'social',
  CONTENT = 'content',
  PAID_ADS = 'paid_ads',
  SEO = 'seo',
  PARTNERSHIP = 'partnership'
}

export enum CampaignType {
  WELCOME = 'welcome',
  ONBOARDING = 'onboarding',
  ENGAGEMENT = 'engagement',
  RETENTION = 'retention',
  REACTIVATION = 'reactivation',
  PROMOTIONAL = 'promotional',
  EDUCATIONAL = 'educational'
}

export enum ABTestStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  WINNER_DECLARED = 'winner_declared'
}

// Referral Program
export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  rewards: {
    referrer: {
      type: 'percentage' | 'fixed' | 'credits';
      value: number;
      currency?: string;
    };
    referee: {
      type: 'percentage' | 'fixed' | 'credits';
      value: number;
      currency?: string;
    };
  };
  conditions: {
    minimumPurchase?: number;
    minimumReferrals?: number;
    expirationDays?: number;
    eligibleProducts?: string[];
  };
  tracking: {
    referralCode: string;
    referralLink: string;
    trackingPixel?: string;
  };
  analytics: {
    totalReferrals: number;
    successfulReferrals: number;
    totalRewards: number;
    conversionRate: number;
  };
}

// Referral
export interface Referral {
  id: string;
  programId: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  rewardAmount: number;
  rewardCurrency: string;
  metadata: Record<string, any>;
}

// Email Campaign
export interface EmailCampaign {
  id: string;
  name: string;
  type: CampaignType;
  subject: string;
  content: string;
  template: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduledAt?: Date;
  sentAt?: Date;
  targetAudience: {
    segments: string[];
    filters: Record<string, any>;
    estimatedRecipients: number;
  };
  settings: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    trackOpens: boolean;
    trackClicks: boolean;
    enableUnsubscribe: boolean;
  };
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
    openRate: number;
    clickRate: number;
  };
  abTestId?: string;
}

// Email Subscriber
export interface EmailSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'subscribed' | 'unsubscribed' | 'pending' | 'bounced';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  segments: string[];
  tags: string[];
  metadata: Record<string, any>;
  analytics: {
    emailsReceived: number;
    emailsOpened: number;
    emailsClicked: number;
    lastEngagement?: Date;
  };
}

// A/B Test
export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: ABTestStatus;
  type: 'email' | 'landing_page' | 'feature' | 'pricing';
  variants: Array<{
    id: string;
    name: string;
    description: string;
    trafficPercentage: number;
    content: Record<string, any>;
    isControl: boolean;
  }>;
  metrics: {
    primary: string;
    secondary: string[];
  };
  settings: {
    startDate: Date;
    endDate?: Date;
    minimumSampleSize: number;
    confidenceLevel: number;
    trafficSplit: '50/50' | '60/40' | '70/30' | '80/20';
  };
  results: {
    totalParticipants: number;
    variantResults: Array<{
      variantId: string;
      participants: number;
      conversions: number;
      conversionRate: number;
      confidence: number;
      isWinner: boolean;
    }>;
    statisticalSignificance: boolean;
    winner?: string;
  };
}

// Growth Marketing Service
export class GrowthMarketingService {
  private referralPrograms: Map<string, ReferralProgram> = new Map();
  private referrals: Map<string, Referral> = new Map();
  private emailCampaigns: Map<string, EmailCampaign> = new Map();
  private subscribers: Map<string, EmailSubscriber> = new Map();
  private abTests: Map<string, ABTest> = new Map();

  constructor() {
    this.initialize();
  }

  // Initialize growth marketing service
  private initialize(): void {
    this.setupDefaultReferralProgram();
    this.setupDefaultEmailCampaigns();
    this.setupDefaultABTests();
    this.setupEventListeners();
  }

  // Setup default referral program
  private setupDefaultReferralProgram(): void {
    const defaultProgram: ReferralProgram = {
      id: 'default-referral',
      name: 'AI Orchestrator Referral Program',
      description: 'Invite friends and earn rewards when they sign up for AI Orchestrator',
      isActive: true,
      rewards: {
        referrer: {
          type: 'percentage',
          value: 20,
          currency: 'USD'
        },
        referee: {
          type: 'percentage',
          value: 10,
          currency: 'USD'
        }
      },
      conditions: {
        minimumPurchase: 50,
        minimumReferrals: 1,
        expirationDays: 30,
        eligibleProducts: ['starter', 'professional', 'enterprise']
      },
      tracking: {
        referralCode: 'FRIEND20',
        referralLink: 'https://aiorchestrator.com/ref/FRIEND20',
        trackingPixel: 'https://aiorchestrator.com/track/referral'
      },
      analytics: {
        totalReferrals: 0,
        successfulReferrals: 0,
        totalRewards: 0,
        conversionRate: 0
      }
    };

    this.referralPrograms.set(defaultProgram.id, defaultProgram);
  }

  // Setup default email campaigns
  private setupDefaultEmailCampaigns(): void {
    const defaultCampaigns: EmailCampaign[] = [
      {
        id: 'welcome-series-1',
        name: 'Welcome Email Series - Day 1',
        type: CampaignType.WELCOME,
        subject: 'Welcome to AI Orchestrator! ',
        content: `
          <h1>Welcome to AI Orchestrator!</h1>
          <p>Hi {{firstName}},</p>
          <p>Welcome to the future of AI-powered chatbots! We're excited to have you on board.</p>
          <p>Here's what you can do to get started:</p>
          <ul>
            <li>Create your first chatbot</li>
            <li>Explore our templates</li>
            <li>Check out our tutorials</li>
          </ul>
          <p>Best regards,<br>The AI Orchestrator Team</p>
        `,
        template: 'welcome',
        status: 'draft',
        targetAudience: {
          segments: ['new_users'],
          filters: { daysSinceSignup: 1 },
          estimatedRecipients: 0
        },
        settings: {
          fromName: 'AI Orchestrator Team',
          fromEmail: 'welcome@aiorchestrator.com',
          trackOpens: true,
          trackClicks: true,
          enableUnsubscribe: true
        },
        analytics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
          bounced: 0,
          openRate: 0,
          clickRate: 0
        }
      },
      {
        id: 'onboarding-series-1',
        name: 'Onboarding - Create Your First Chatbot',
        type: CampaignType.ONBOARDING,
        subject: 'Ready to create your first chatbot? ',
        content: `
          <h1>Let's Build Your First Chatbot!</h1>
          <p>Hi {{firstName}},</p>
          <p>Now that you're familiar with AI Orchestrator, let's create your first chatbot!</p>
          <p>Follow these simple steps:</p>
          <ol>
            <li>Choose a template</li>
            <li>Customize your bot</li>
            <li>Train it with your data</li>
            <li>Deploy and test</li>
          </ol>
          <p>Need help? Our support team is here for you!</p>
          <p>Best regards,<br>The AI Orchestrator Team</p>
        `,
        template: 'onboarding',
        status: 'draft',
        targetAudience: {
          segments: ['new_users'],
          filters: { daysSinceSignup: 3, hasNotCreatedBot: true },
          estimatedRecipients: 0
        },
        settings: {
          fromName: 'AI Orchestrator Team',
          fromEmail: 'onboarding@aiorchestrator.com',
          trackOpens: true,
          trackClicks: true,
          enableUnsubscribe: true
        },
        analytics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
          bounced: 0,
          openRate: 0,
          clickRate: 0
        }
      }
    ];

    defaultCampaigns.forEach(campaign => {
      this.emailCampaigns.set(campaign.id, campaign);
    });
  }

  // Setup default A/B tests
  private setupDefaultABTests(): void {
    const defaultTests: ABTest[] = [
      {
        id: 'landing-page-cta',
        name: 'Landing Page CTA Button Test',
        description: 'Testing different CTA button colors and text to improve conversion rates',
        status: ABTestStatus.DRAFT,
        type: 'landing_page',
        variants: [
          {
            id: 'control',
            name: 'Control - Blue Button',
            description: 'Original blue "Get Started" button',
            trafficPercentage: 50,
            content: {
              buttonColor: '#3B82F6',
              buttonText: 'Get Started',
              buttonStyle: 'primary'
            },
            isControl: true
          },
          {
            id: 'variant-a',
            name: 'Variant A - Green Button',
            description: 'Green "Start Free Trial" button',
            trafficPercentage: 50,
            content: {
              buttonColor: '#10B981',
              buttonText: 'Start Free Trial',
              buttonStyle: 'primary'
            },
            isControl: false
          }
        ],
        metrics: {
          primary: 'conversion_rate',
          secondary: ['click_through_rate', 'time_on_page']
        },
        settings: {
          startDate: new Date(),
          minimumSampleSize: 1000,
          confidenceLevel: 0.95,
          trafficSplit: '50/50'
        },
        results: {
          totalParticipants: 0,
          variantResults: [],
          statisticalSignificance: false
        }
      }
    ];

    defaultTests.forEach(test => {
      this.abTests.set(test.id, test);
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to user events for growth tracking
    analyticsService.on('event', (event: any) => {
      if (event.type === 'user_signed_up') {
        this.handleUserSignup(event);
              } else if (event.type === 'referral_completed') {
        this.handleReferralCompleted(event);
              } else if (event.type === 'email_opened') {
        this.handleEmailOpened(event);
              } else if (event.type === 'email_clicked') {
        this.handleEmailClicked(event);
      }
    });
  }

  // Handle user signup
  private handleUserSignup(event: any): void {
    const userId = event.properties?.userId;
    const referralCode = event.properties?.referralCode;
    
    if (referralCode) {
      this.processReferral(userId, referralCode);
    }

    // Add to email list
    this.addEmailSubscriber({
      email: event.properties?.email,
      firstName: event.properties?.firstName,
      lastName: event.properties?.lastName,
      segments: ['new_users'],
      tags: ['signup'],
      metadata: {}
    });
  }

  // Handle referral completed
  private handleReferralCompleted(event: any): void {
    const referralId = event.properties?.referralId;
    const rewardAmount = event.properties?.rewardAmount;
    
    if (referralId) {
      this.completeReferral(referralId, rewardAmount);
    }
  }

  // Handle email opened
  private handleEmailOpened(event: any): void {
    const campaignId = event.properties?.campaignId;
    const subscriberId = event.properties?.subscriberId;
    
    if (campaignId && subscriberId) {
      this.trackEmailOpen(campaignId, subscriberId);
    }
  }

  // Handle email clicked
  private handleEmailClicked(event: any): void {
    const campaignId = event.properties?.campaignId;
    const subscriberId = event.properties?.subscriberId;
    const linkUrl = event.properties?.linkUrl;
    
    if (campaignId && subscriberId) {
      this.trackEmailClick(campaignId, subscriberId, linkUrl);
    }
  }

  // Process referral
  private processReferral(userId: string, referralCode: string): void {
    const program = this.findReferralProgramByCode(referralCode);
    if (!program) return;

    const referrerId = this.findReferrerByCode();
    if (!referrerId) return;

    const referral: Referral = {
      id: this.generateId(),
      programId: program.id,
      referrerId,
      refereeId: userId,
      referralCode,
      status: 'pending',
      createdAt: new Date(),
      rewardAmount: program.rewards.referee.value,
      rewardCurrency: program.rewards.referee.currency || 'USD',
      metadata: {}
    };

    this.referrals.set(referral.id, referral);
    this.updateReferralProgramAnalytics(program.id, 'totalReferrals', 1);

    // Track with analytics
    analyticsService.track('referral_created', {
      referralId: referral.id,
      programId: program.id,
      referrerId,
      refereeId: userId,
      referralCode
    });
  }

  // Complete referral
  private completeReferral(referralId: string, rewardAmount: number): void {
    const referral = this.referrals.get(referralId);
    if (!referral) return;

    referral.status = 'completed';
    referral.completedAt = new Date();
    referral.rewardAmount = rewardAmount;

    const program = this.referralPrograms.get(referral.programId);
    if (program) {
      this.updateReferralProgramAnalytics(program.id, 'successfulReferrals', 1);
      this.updateReferralProgramAnalytics(program.id, 'totalRewards', rewardAmount);
    }

    // Track with analytics
    analyticsService.track('referral_completed', {
      referralId,
      programId: referral.programId,
      referrerId: referral.referrerId,
      refereeId: referral.refereeId,
      rewardAmount
    });
  }

  // Find referral program by code
  private findReferralProgramByCode(code: string): ReferralProgram | null {
    const programs = Array.from(this.referralPrograms.values());
    return programs.find(program => program.tracking.referralCode === code) || null;
  }

  // Find referrer by code
  private findReferrerByCode(): string | null {
    // In a real implementation, this would query the database
    // For now, we'll return a mock referrer ID
    return 'mock-referrer-id';
  }

  // Update referral program analytics
  private updateReferralProgramAnalytics(programId: string, metric: keyof ReferralProgram['analytics'], value: number): void {
    const program = this.referralPrograms.get(programId);
    if (!program) return;

    program.analytics[metric] += value;
    
    // Recalculate conversion rate
    if (program.analytics.totalReferrals > 0) {
      program.analytics.conversionRate = (program.analytics.successfulReferrals / program.analytics.totalReferrals) * 100;
    }
  }

  // Add email subscriber
  public addEmailSubscriber(subscriberData: Omit<EmailSubscriber, 'id' | 'status' | 'subscribedAt' | 'analytics'>): EmailSubscriber {
    const subscriber: EmailSubscriber = {
      ...subscriberData,
      id: this.generateId(),
      status: 'subscribed',
      subscribedAt: new Date(),
      segments: subscriberData.segments || [],
      tags: subscriberData.tags || [],
      metadata: subscriberData.metadata || {},
      analytics: {
        emailsReceived: 0,
        emailsOpened: 0,
        emailsClicked: 0
      }
    };

    this.subscribers.set(subscriber.id, subscriber);

    // Track with analytics
    analyticsService.track('email_subscribed', {
      subscriberId: subscriber.id,
      email: subscriber.email,
      segments: subscriber.segments.join(','),
      tags: subscriber.tags.join(',')
    });

    return subscriber;
  }

  // Track email open
  private trackEmailOpen(campaignId: string, subscriberId: string): void {
    const campaign = this.emailCampaigns.get(campaignId);
    const subscriber = this.subscribers.get(subscriberId);

    if (campaign) {
      campaign.analytics.opened += 1;
      campaign.analytics.openRate = (campaign.analytics.opened / campaign.analytics.delivered) * 100;
    }

    if (subscriber) {
      subscriber.analytics.emailsOpened += 1;
      subscriber.analytics.lastEngagement = new Date();
    }

    // Track with analytics
    analyticsService.track('email_opened', {
      campaignId,
      subscriberId,
      subscriberEmail: subscriber?.email || '',
      subscriberSegments: subscriber?.segments?.join(',') || '',
      subscriberTags: subscriber?.tags?.join(',') || ''
    });
  }

  // Track email click
  private trackEmailClick(campaignId: string, subscriberId: string, linkUrl?: string): void {
    const campaign = this.emailCampaigns.get(campaignId);
    const subscriber = this.subscribers.get(subscriberId);

    if (campaign) {
      campaign.analytics.clicked += 1;
      campaign.analytics.clickRate = (campaign.analytics.clicked / campaign.analytics.delivered) * 100;
    }

    if (subscriber) {
      subscriber.analytics.emailsClicked += 1;
      subscriber.analytics.lastEngagement = new Date();
    }

    // Track with analytics
    analyticsService.track('email_clicked', {
      campaignId,
      subscriberId,
      linkUrl: linkUrl || '',
      subscriberEmail: subscriber?.email || '',
      subscriberSegments: subscriber?.segments?.join(',') || '',
      subscriberTags: subscriber?.tags?.join(',') || ''
    });
  }

  // Create referral program
  public createReferralProgram(programData: Omit<ReferralProgram, 'id' | 'analytics'>): ReferralProgram {
    const program: ReferralProgram = {
      ...programData,
      id: this.generateId(),
      analytics: {
        totalReferrals: 0,
        successfulReferrals: 0,
        totalRewards: 0,
        conversionRate: 0
      }
    };

    this.referralPrograms.set(program.id, program);
    return program;
  }

  // Get referral program
  public getReferralProgram(programId: string): ReferralProgram | null {
    return this.referralPrograms.get(programId) || null;
  }

  // Get all referral programs
  public getReferralPrograms(): ReferralProgram[] {
    return Array.from(this.referralPrograms.values());
  }

  // Update referral program
  public updateReferralProgram(programId: string, updates: Partial<ReferralProgram>): ReferralProgram | null {
    const program = this.referralPrograms.get(programId);
    if (!program) return null;

    const updatedProgram: ReferralProgram = {
      ...program,
      ...updates
    };

    this.referralPrograms.set(programId, updatedProgram);
    return updatedProgram;
  }

  // Get referrals
  public getReferrals(programId?: string, status?: string): Referral[] {
    let referrals = Array.from(this.referrals.values());

    if (programId) {
      referrals = referrals.filter(ref => ref.programId === programId);
    }

    if (status) {
      referrals = referrals.filter(ref => ref.status === status);
    }

    return referrals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Create email campaign
  public createEmailCampaign(campaignData: Omit<EmailCampaign, 'id' | 'analytics'>): EmailCampaign {
    const campaign: EmailCampaign = {
      ...campaignData,
      id: this.generateId(),
      analytics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
        openRate: 0,
        clickRate: 0
      }
    };

    this.emailCampaigns.set(campaign.id, campaign);
    return campaign;
  }

  // Get email campaign
  public getEmailCampaign(campaignId: string): EmailCampaign | null {
    return this.emailCampaigns.get(campaignId) || null;
  }

  // Get all email campaigns
  public getEmailCampaigns(type?: CampaignType, status?: string): EmailCampaign[] {
    let campaigns = Array.from(this.emailCampaigns.values());

    if (type) {
      campaigns = campaigns.filter(campaign => campaign.type === type);
    }

    if (status) {
      campaigns = campaigns.filter(campaign => campaign.status === status);
    }

    return campaigns.sort((a, b) => {
      if (a.scheduledAt && b.scheduledAt) {
        return b.scheduledAt.getTime() - a.scheduledAt.getTime();
      }
      return b.sentAt?.getTime() || 0 - (a.sentAt?.getTime() || 0);
    });
  }

  // Update email campaign
  public updateEmailCampaign(campaignId: string, updates: Partial<EmailCampaign>): EmailCampaign | null {
    const campaign = this.emailCampaigns.get(campaignId);
    if (!campaign) return null;

    const updatedCampaign: EmailCampaign = {
      ...campaign,
      ...updates
    };

    this.emailCampaigns.set(campaignId, updatedCampaign);
    return updatedCampaign;
  }

  // Send email campaign
  public async sendEmailCampaign(campaignId: string): Promise<boolean> {
    const campaign = this.emailCampaigns.get(campaignId);
    if (!campaign || campaign.status !== 'draft') return false;

    // Update campaign status
    campaign.status = 'sending';
    campaign.sentAt = new Date();

    // Get target subscribers
    const subscribers = this.getSubscribersBySegments(campaign.targetAudience.segments);
    
    // Simulate sending emails
    for (const subscriber of subscribers) {
      await this.sendEmailToSubscriber(campaign, subscriber);
    }

    // Update campaign status
    campaign.status = 'sent';
    campaign.analytics.sent = subscribers.length;
    campaign.analytics.delivered = subscribers.length;

    return true;
  }

  // Send email to subscriber
  private async sendEmailToSubscriber(campaign: EmailCampaign, subscriber: EmailSubscriber): Promise<void> {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));

    // Update subscriber analytics
    subscriber.analytics.emailsReceived += 1;

    // Track with analytics
    analyticsService.track('email_sent', {
      campaignId: campaign.id,
      subscriberId: subscriber.id,
      email: subscriber.email
    });
  }

  // Get subscribers by segments
  private getSubscribersBySegments(segments: string[]): EmailSubscriber[] {
    const subscribers = Array.from(this.subscribers.values());
    return subscribers.filter(subscriber => 
      subscriber.status === 'subscribed' &&
      segments.some(segment => subscriber.segments.includes(segment))
    );
  }

  // Get subscribers
  public getSubscribers(status?: string, segments?: string[]): EmailSubscriber[] {
    let subscribers = Array.from(this.subscribers.values());

    if (status) {
      subscribers = subscribers.filter(sub => sub.status === status);
    }

    if (segments) {
      subscribers = subscribers.filter(sub => 
        segments.some(segment => sub.segments.includes(segment))
      );
    }

    return subscribers.sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime());
  }

  // Unsubscribe subscriber
  public unsubscribeSubscriber(subscriberId: string): boolean {
    const subscriber = this.subscribers.get(subscriberId);
    if (!subscriber) return false;

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();

    // Track with analytics
    analyticsService.track('email_unsubscribed', {
      subscriberId,
      email: subscriber.email
    });

    return true;
  }

  // Create A/B test
  public createABTest(testData: Omit<ABTest, 'id' | 'results'>): ABTest {
    const test: ABTest = {
      ...testData,
      id: this.generateId(),
      results: {
        totalParticipants: 0,
        variantResults: testData.variants.map(variant => ({
          variantId: variant.id,
          participants: 0,
          conversions: 0,
          conversionRate: 0,
          confidence: 0,
          isWinner: false
        })),
        statisticalSignificance: false
      }
    };

    this.abTests.set(test.id, test);
    return test;
  }

  // Get A/B test
  public getABTest(testId: string): ABTest | null {
    return this.abTests.get(testId) || null;
  }

  // Get all A/B tests
  public getABTests(status?: ABTestStatus, type?: string): ABTest[] {
    let tests = Array.from(this.abTests.values());

    if (status) {
      tests = tests.filter(test => test.status === status);
    }

    if (type) {
      tests = tests.filter(test => test.type === type);
    }

    return tests.sort((a, b) => b.settings.startDate.getTime() - a.settings.startDate.getTime());
  }

  // Start A/B test
  public startABTest(testId: string): boolean {
    const test = this.abTests.get(testId);
    if (!test || test.status !== ABTestStatus.DRAFT) return false;

    test.status = ABTestStatus.RUNNING;
    test.settings.startDate = new Date();

    return true;
  }

  // Stop A/B test
  public stopABTest(testId: string): boolean {
    const test = this.abTests.get(testId);
    if (!test || test.status !== ABTestStatus.RUNNING) return false;

    test.status = ABTestStatus.COMPLETED;
    test.settings.endDate = new Date();

    // Calculate results
    this.calculateABTestResults(test);

    return true;
  }

  // Calculate A/B test results
  private calculateABTestResults(test: ABTest): void {
    // Simulate calculating statistical significance and winner
    test.results.statisticalSignificance = Math.random() > 0.5;
    
    if (test.results.statisticalSignificance) {
      const winner = test.variants[Math.floor(Math.random() * test.variants.length)];
      test.results.winner = winner.id;
      test.status = ABTestStatus.WINNER_DECLARED;
    }
  }

  // Track A/B test participation
  public trackABTestParticipation(testId: string, variantId: string, userId: string): void {
    const test = this.abTests.get(testId);
    if (!test || test.status !== ABTestStatus.RUNNING) return;

    test.results.totalParticipants += 1;
    
    const variantResult = test.results.variantResults.find(vr => vr.variantId === variantId);
    if (variantResult) {
      variantResult.participants += 1;
    }

    // Track with analytics
    analyticsService.track('ab_test_participation', {
      testId,
      variantId,
      userId
    });
  }

  // Track A/B test conversion
  public trackABTestConversion(testId: string, variantId: string, userId: string): void {
    const test = this.abTests.get(testId);
    if (!test || test.status !== ABTestStatus.RUNNING) return;

    const variantResult = test.results.variantResults.find(vr => vr.variantId === variantId);
    if (variantResult) {
      variantResult.conversions += 1;
      variantResult.conversionRate = (variantResult.conversions / variantResult.participants) * 100;
    }

    // Track with analytics
    analyticsService.track('ab_test_conversion', {
      testId,
      variantId,
      userId
    });
  }

  // Get growth analytics
  public getGrowthAnalytics(): {
    referralMetrics: {
      totalReferrals: number;
      successfulReferrals: number;
      conversionRate: number;
      totalRewards: number;
    };
    emailMetrics: {
      totalSubscribers: number;
      activeSubscribers: number;
      averageOpenRate: number;
      averageClickRate: number;
    };
    abTestMetrics: {
      activeTests: number;
      completedTests: number;
      winningTests: number;
    };
  } {
    const referralMetrics = {
      totalReferrals: 0,
      successfulReferrals: 0,
      conversionRate: 0,
      totalRewards: 0
    };

    const emailMetrics = {
      totalSubscribers: 0,
      activeSubscribers: 0,
      averageOpenRate: 0,
      averageClickRate: 0
    };

    const abTestMetrics = {
      activeTests: 0,
      completedTests: 0,
      winningTests: 0
    };

    // Calculate referral metrics
    this.referralPrograms.forEach(program => {
      referralMetrics.totalReferrals += program.analytics.totalReferrals;
      referralMetrics.successfulReferrals += program.analytics.successfulReferrals;
      referralMetrics.totalRewards += program.analytics.totalRewards;
    });

    if (referralMetrics.totalReferrals > 0) {
      referralMetrics.conversionRate = (referralMetrics.successfulReferrals / referralMetrics.totalReferrals) * 100;
    }

    // Calculate email metrics
    const subscribers = Array.from(this.subscribers.values());
    emailMetrics.totalSubscribers = subscribers.length;
    emailMetrics.activeSubscribers = subscribers.filter(s => s.status === 'subscribed').length;

    const campaigns = Array.from(this.emailCampaigns.values());
    const sentCampaigns = campaigns.filter(c => c.analytics.sent > 0);
    
    if (sentCampaigns.length > 0) {
      emailMetrics.averageOpenRate = sentCampaigns.reduce((sum, c) => sum + c.analytics.openRate, 0) / sentCampaigns.length;
      emailMetrics.averageClickRate = sentCampaigns.reduce((sum, c) => sum + c.analytics.clickRate, 0) / sentCampaigns.length;
    }

    // Calculate A/B test metrics
    const tests = Array.from(this.abTests.values());
    abTestMetrics.activeTests = tests.filter(t => t.status === ABTestStatus.RUNNING).length;
    abTestMetrics.completedTests = tests.filter(t => t.status === ABTestStatus.COMPLETED).length;
    abTestMetrics.winningTests = tests.filter(t => t.status === ABTestStatus.WINNER_DECLARED).length;

    return {
      referralMetrics,
      emailMetrics,
      abTestMetrics
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const growthMarketingService = new GrowthMarketingService();

// Export default instance
export default growthMarketingService; 