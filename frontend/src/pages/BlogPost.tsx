import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Twitter, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const POSTS: Record<string, any> = {
  'ai-chatbots-revolutionizing-customer-service-2025': {
    title: 'How AI Chatbots Are Revolutionizing Customer Service in 2025',
    author: 'AI Orchestrator Team',
    date: '2025-01-15',
    readTime: '8 min read',
    heroGradient: 'from-blue-600 to-purple-600',
    intro:
      'In 2025, AI chatbots have moved from simple FAQs to becoming strategic growth drivers. Here’s how leading brands are using AI to boost revenue, cut support costs, and deliver 24/7 experiences customers love.',
    sections: [
      {
        heading: '1) Instant, multilingual support (customers get answers fast)',
        content:
          'Modern chatbots detect language automatically, so customers can ask in Italian, English, or 100+ languages and get a precise answer instantly. No queues, no tickets. Brands see CSAT lift and faster resolutions.'
      },
      {
        heading: '2) Revenue-first assistants embedded in the journey',
        content:
          'Chatbots are no longer isolated. They live where users make decisions: product pages, checkout, post‑purchase. They recommend products, add to cart with one click, and recover abandoned sessions with timely prompts.'
      },
      {
        heading: '3) Powered by real data, not canned scripts',
        content:
          'The latest assistants connect to your product catalog, FAQs, order data, and logistics. This means accurate answers about availability, shipping times, and returns. No hallucinations; just verified answers from your source of truth.'
      },
      {
        heading: '4) From cost center to growth channel',
        content:
          'Teams report ticket deflection of 30–60% and significant uplift in conversion rates when AI handles pre‑purchase questions instantly. With analytics, you can see which intents drive sales and where customers drop off.'
      },
      {
        heading: '5) Built for real operations',
        content:
          'Role‑based access, audit trails, analytics, and safe‑mode guardrails are now standard. Instead of “toy demos”, businesses deploy assistants that meet compliance needs and scale globally.'
      }
    ],
    takeaway:
      'AI chatbots in 2025 are revenue engines and brand guardians. The winners aren’t those who bolt on another widget—but those who integrate AI where it matters: the customer journey.'
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? POSTS[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-6">The blog post you are looking for doesn’t exist.</p>
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className={`bg-gradient-to-br ${post.heroGradient} py-20 text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-white/90 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-white/90 gap-4">
            <div className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</div>
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(post.date).toLocaleDateString()}</div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {post.readTime}</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8 prose prose-lg max-w-none">
            <p className="text-xl text-gray-700">{post.intro}</p>
            <div className="h-64 md:h-80 w-full my-8 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200" />

            {post.sections.map((sec: any, idx: number) => (
              <section key={idx} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{sec.heading}</h2>
                <p className="text-gray-700 leading-relaxed">{sec.content}</p>
              </section>
            ))}

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl mt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Key Takeaway</h3>
              <p className="text-gray-700">{post.takeaway}</p>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
              </Link>
              <Link to="/pricing" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                Explore Pricing <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Share this article</h3>
              <div className="flex gap-3">
                <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300">
                  <Twitter className="w-4 h-4 text-blue-500" /> Twitter
                </a>
                <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300">
                  <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn
                </a>
                <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300">
                  <Facebook className="w-4 h-4 text-blue-700" /> Facebook
                </a>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build your AI assistant</h3>
              <p className="text-gray-700 mb-4">Create a multilingual, brand‑ready chatbot in minutes. No code needed.</p>
              <Link to="/pricing" className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 AI Orchestrator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
