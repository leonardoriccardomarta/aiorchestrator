import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { id: 'default-tenant' },
    update: {},
    create: {
      id: 'default-tenant',
      name: 'Default Tenant',
      domain: 'localhost',
      isActive: true,
    },
  });

  console.log('✅ Default tenant created:', defaultTenant.name);

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date(),
      tenantId: defaultTenant.id,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      password: hashedPassword,
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date(),
      tenantId: defaultTenant.id,
      role: 'USER',
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create sample chatbots
  const chatbot1 = await prisma.chatbot.upsert({
    where: { id: 'demo-chatbot-1' },
    update: {},
    create: {
      id: 'demo-chatbot-1',
      name: 'Customer Support Bot',
      description: 'Helps customers with common questions and support issues',
      isActive: true,
      ownerId: adminUser.id,
      tenantId: defaultTenant.id,
      model: 'gpt-3.5-turbo',
      personality: 'helpful',
      responseStyle: 'professional',
      temperature: 0.7,
      maxTokens: 1000,
      whatsappEnabled: true,
      messengerEnabled: true,
      totalMessages: 150,
      avgResponseTime: 1.2,
      satisfactionScore: 4.8,
    },
  });

  await prisma.chatbot.upsert({
    where: { id: 'demo-chatbot-2' },
    update: {},
    create: {
      id: 'demo-chatbot-2',
      name: 'Sales Assistant',
      description: 'Assists with product inquiries and sales questions',
      isActive: true,
      ownerId: adminUser.id,
      tenantId: defaultTenant.id,
      model: 'gpt-4',
      personality: 'friendly',
      responseStyle: 'conversational',
      temperature: 0.8,
      maxTokens: 1500,
      telegramEnabled: true,
      shopifyEnabled: true,
      totalMessages: 89,
      avgResponseTime: 0.9,
      satisfactionScore: 4.9,
    },
  });

  console.log('✅ Sample chatbots created');

  // Create sample FAQs
  const faqs = [
    {
      question: 'How do I create a new chatbot?',
      answer: 'Go to the Chatbots section in your dashboard and click "Create New Bot". Fill in the required information and configure your bot settings.',
      category: 'Getting Started',
      tags: 'chatbot,create,setup',
    },
    {
      question: 'How to integrate with WhatsApp?',
      answer: 'Use the integration panel in your chatbot settings. You\'ll need to provide your WhatsApp Business API credentials.',
      category: 'Integrations',
      tags: 'whatsapp,integration,api',
    },
    {
      question: 'What AI models are supported?',
      answer: 'We support OpenAI GPT-3.5-turbo, GPT-4, and other popular language models. You can choose the model that best fits your needs.',
      category: 'AI Configuration',
      tags: 'ai,models,openai,gpt',
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer flexible pricing plans starting from $29/month. Check our pricing page for detailed information about features and limits.',
      category: 'Billing',
      tags: 'pricing,billing,plans',
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        tags: faq.tags,
        isActive: true,
        order: 0,
        ownerId: adminUser.id,
        tenantId: defaultTenant.id,
      },
    });
  }

  console.log('✅ Sample FAQs created');

  // Create sample plans
  const plans = [
    {
      id: 'starter-plan',
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      price: 2900, // $29.00 in cents
      currency: 'usd',
      interval: 'MONTHLY',
      intervalCount: 1,
      isActive: true,
      apiCallsLimit: 10000,
      storageLimit: 5,
      usersLimit: 3,
      chatbotsLimit: 5,
      features: 'basic_support,whatsapp_integration,analytics',
    },
    {
      id: 'professional-plan',
      name: 'Professional',
      description: 'For growing businesses with advanced needs',
      price: 9900, // $99.00 in cents
      currency: 'usd',
      interval: 'MONTHLY',
      intervalCount: 1,
      isActive: true,
      apiCallsLimit: 50000,
      storageLimit: 25,
      usersLimit: 10,
      chatbotsLimit: 20,
      features: 'priority_support,all_integrations,advanced_analytics,workflows',
    },
    {
      id: 'enterprise-plan',
      name: 'Enterprise',
      description: 'For large organizations with custom requirements',
      price: 29900, // $299.00 in cents
      currency: 'usd',
      interval: 'MONTHLY',
      intervalCount: 1,
      isActive: true,
      apiCallsLimit: 200000,
      storageLimit: 100,
      usersLimit: 50,
      chatbotsLimit: 100,
      features: 'dedicated_support,all_integrations,advanced_analytics,workflows,custom_branding,api_access',
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    });
  }

  console.log('✅ Sample plans created');

  // Create sample analytics data
  const analyticsData = [
    {
      type: 'MESSAGE_SENT',
      entityId: chatbot1.id,
      entityType: 'chatbot',
      tenantId: defaultTenant.id,
      userId: adminUser.id,
      data: JSON.stringify({
        messageCount: 150,
        responseTime: 1.2,
        satisfaction: 4.8,
        timestamp: new Date().toISOString(),
      }),
    },
    {
      type: 'USER_ACTIVITY',
      entityId: adminUser.id,
      entityType: 'user',
      tenantId: defaultTenant.id,
      userId: adminUser.id,
      data: JSON.stringify({
        action: 'chatbot_created',
        chatbotId: chatbot1.id,
        timestamp: new Date().toISOString(),
      }),
    },
  ];

  for (const analytics of analyticsData) {
    try {
      await prisma.analytics.create({
        data: analytics,
      });
    } catch (error) {
      console.log('⚠️  Analytics creation skipped (foreign key constraint)');
    }
  }

  console.log('✅ Sample analytics data created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Demo: demo@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });