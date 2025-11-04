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
    heroGradient: 'from-blue-600 to-purple-600',
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
      'AI chatbots in 2025 are revenue engines and brand guardians. The winners aren\'t those who bolt on another widget—but those who integrate AI where it matters: the customer journey.'
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
      <header className={`bg-gradient-to-br ${post.heroGradient} py-16 md:py-20 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-white/90 gap-4 text-sm">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" /> {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" /> {post.readTime}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <article className="lg:col-span-8">
              {/* Cover Image */}
              <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
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
              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <p className="text-xl text-gray-700 leading-relaxed">{post.intro}</p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {post.sections.map((sec: any, idx: number) => (
                  <section key={idx} className="bg-white rounded-xl border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{sec.heading}</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{sec.content}</p>
                  </section>
                ))}
              </div>

              {/* Key Takeaway */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Takeaway</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{post.takeaway}</p>
              </div>

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between pt-8 border-t border-gray-200">
                <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                </Link>
                <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Explore Pricing <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Share */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      <Twitter className="w-4 h-4 text-blue-500" /> Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      <Facebook className="w-4 h-4 text-blue-700" /> Facebook
                    </a>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Build your AI assistant</h3>
                  <p className="text-gray-700 mb-4 text-sm">Create a multilingual, brand-ready chatbot in minutes. No code needed.</p>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
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
