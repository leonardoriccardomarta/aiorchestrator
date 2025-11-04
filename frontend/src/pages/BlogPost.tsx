import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Twitter, Linkedin, Facebook, ArrowRight } from 'lucide-react';
import LiveChatWidget from '../components/LiveChatWidget';

const POSTS: Record<string, any> = {
  'ai-chatbots-revolutionizing-customer-service-2025': {
    title: 'How AI Chatbots Are Revolutionizing Customer Service in 2025',
    author: 'AI Orchestrator Team',
    date: '2025-11-04',
    readTime: '8 min read',
    heroGradient: 'from-blue-50 to-indigo-50',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    intro:
      'In 2025, AI chatbots have moved from simple FAQs to becoming strategic growth drivers. Here\'s how leading brands are using AI to boost revenue, cut support costs, and deliver 24/7 experiences customers love.',
    sections: [
      {
        heading: '1) Instant, multilingual support (customers get answers fast)',
        content:
          'Modern chatbots detect language automatically, so customers can ask in Italian, English, or 100+ languages and get a precise answer instantly. No queues, no tickets. Brands see CSAT lift and faster resolutions.'
      },
      {
        heading: '2) Revenue-first assistants embedded in the journey',
        content:
          'Chatbots are no longer isolated. They live where users make decisions: product pages, checkout, post-purchase. They recommend products, add to cart with one click, and recover abandoned sessions with timely prompts.'
      },
      {
        heading: '3) Powered by real data, not canned scripts',
        content:
          'The latest assistants connect to your product catalog, FAQs, order data, and logistics. This means accurate answers about availability, shipping times, and returns. No hallucinations; just verified answers from your source of truth.'
      },
      {
        heading: '4) From cost center to growth channel',
        content:
          'Teams report ticket deflection of 30–60% and significant uplift in conversion rates when AI handles pre-purchase questions instantly. With analytics, you can see which intents drive sales and where customers drop off.'
      },
      {
        heading: '5) Built for real operations',
        content:
          'Role-based access, audit trails, analytics, and safe-mode guardrails are now standard. Instead of "toy demos", businesses deploy assistants that meet compliance needs and scale globally.'
      }
    ],
    takeaway:
      'AI chatbots in 2025 are revenue engines and brand guardians. The winners aren\'t those who bolt on another widget but those who integrate AI where it matters: the customer journey.'
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? POSTS[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <LiveChatWidget />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-6">The blog post you are looking for doesn't exist.</p>
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LiveChatWidget />

      {/* Hero Section */}
      <header className={`bg-gradient-to-br ${post.heroGradient} py-12 sm:py-16 md:py-20 text-gray-900 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-sm sm:text-base text-gray-700 hover:text-gray-900 active:text-gray-800 mb-4 sm:mb-6 transition-colors touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" /> <span className="hidden sm:inline">Back to Blog</span><span className="sm:hidden">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 sm:mb-6 px-2 sm:px-0">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-gray-700 gap-3 sm:gap-4 text-xs sm:text-sm px-2 sm:px-0">
            <div className="flex items-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" /> {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="sm:hidden">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" /> {post.readTime}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <article className="lg:col-span-8">
              {/* Cover Image */}
              <div className="mb-6 sm:mb-8 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop';
                  }}
                />
              </div>

              {/* Intro */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">{post.intro}</p>
              </div>

              {/* Sections */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {post.sections.map((sec: any, idx: number) => (
                  <section key={idx} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">{sec.heading}</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{sec.content}</p>
                  </section>
                ))}
              </div>

              {/* Key Takeaway */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 md:mt-10">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Key Takeaway</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{post.takeaway}</p>
              </div>

              {/* Navigation */}
              <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-200">
                <Link to="/blog" className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium transition-colors touch-manipulation min-h-[44px]">
                  <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" /> Back to Blog
                </Link>
                <Link to="/#pricing" className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium transition-colors touch-manipulation min-h-[44px]">
                  Explore Pricing <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24 space-y-4 sm:space-y-6">
                {/* Share */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Share this article</h3>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm font-medium text-gray-700 min-h-[44px] touch-manipulation"
                    >
                      <Twitter className="w-4 h-4 text-blue-500 flex-shrink-0" /> Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm font-medium text-gray-700 min-h-[44px] touch-manipulation"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" /> LinkedIn
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm font-medium text-gray-700 min-h-[44px] touch-manipulation"
                    >
                      <Facebook className="w-4 h-4 text-blue-700 flex-shrink-0" /> Facebook
                    </a>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Build your AI assistant</h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">Create a multilingual, brand-ready chatbot in minutes. No code needed.</p>
                  <Link
                    to="/#pricing"
                    className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm min-h-[44px] touch-manipulation"
                  >
                    Get Started <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
