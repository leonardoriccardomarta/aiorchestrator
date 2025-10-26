const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupBlobUrls() {
  try {
    console.log('🧹 Starting blob URL cleanup...');
    
    // Get all chatbots
    const chatbots = await prisma.chatbot.findMany({
      select: { id: true, name: true, settings: true }
    });
    
    console.log(`📋 Found ${chatbots.length} chatbots to check`);
    
    let cleanedCount = 0;
    
    for (const chatbot of chatbots) {
      if (!chatbot.settings) continue;
      
      try {
        const settings = typeof chatbot.settings === 'string' ? JSON.parse(chatbot.settings) : chatbot.settings;
        
        if (settings.branding && settings.branding.logo && typeof settings.branding.logo === 'string') {
          // Remove blob URLs - they expire and cause errors
          if (settings.branding.logo.startsWith('blob:')) {
            console.log(`🧹 Removing expired blob URL from chatbot: ${chatbot.name} (${chatbot.id})`);
            settings.branding.logo = '';
            
            // Update in database
            await prisma.chatbot.update({
              where: { id: chatbot.id },
              data: { settings: settings }
            });
            
            cleanedCount++;
          }
        }
      } catch (e) {
        console.error(`❌ Error cleaning chatbot ${chatbot.id}:`, e.message);
      }
    }
    
    console.log(`✅ Cleanup complete! Cleaned ${cleanedCount} blob URLs from ${chatbots.length} chatbots`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupBlobUrls();


