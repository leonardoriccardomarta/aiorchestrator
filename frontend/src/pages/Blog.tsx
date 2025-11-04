import React, { useMemo, useState } from 'react';
import { Calendar, User, ArrowRight, Search, Tag, Clock } from 'lucide-react';
import LiveChatWidget from '../components/LiveChatWidget';
import { useNavigate } from 'react-router-dom';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return [
      { id: 'all', name: 'All Posts', count: blogPosts.length },
      { id: 'ai', name: 'AI & Machine Learning', count: counts['ai'] || 0 }
  ];
  }, []);

  const blogPosts = [
    {
      id: 1,
      slug: 'ai-chatbots-revolutionizing-customer-service-2025',
      title: 'How AI Chatbots Are Revolutionizing Customer Service in 2025',
      excerpt: 'Discover the latest trends in AI-powered customer service and how businesses are using chatbots to improve customer satisfaction.',
      author: 'AI Orchestrator Team',
      date: '2025-01-15',
      readTime: '8 min read',
      tags: ['ai'],
      featured: true,
      image: '/api/placeholder/600/400'
    },
    {
      id: 2,
      slug: 'multi-language-chatbot-setup-guide',
      title: 'Complete Guide to Multi-Language Chatbot Setup',
      excerpt: 'Step-by-step tutorial on configuring your chatbot to support multiple languages and reach global customers.',
      author: 'Sarah Johnson',
      date: '2025-01-12',
      readTime: '12 min read',
      tags: ['tutorials'],
      featured: false,
      image: '/api/placeholder/600/400'
    },
    {
      id: 3,
      slug: 'case-study-fashion-store-increased-sales-40',
      title: 'Case Study: How Fashion Store Increased Sales by 40% with AI',
      excerpt: 'Learn how a leading fashion retailer used AI Orchestrator to boost conversion rates and customer engagement.',
      author: 'Marketing Team',
      date: '2025-01-10',
      readTime: '6 min read',
      tags: ['case-studies'],
      featured: false,
      image: '/api/placeholder/600/400'
    },
    {
      id: 4,
      slug: 'understanding-sentiment-analysis-customer-conversations',
      title: 'Understanding Sentiment Analysis in Customer Conversations',
      excerpt: 'Deep dive into how AI analyzes customer emotions and intent to provide better support experiences.',
      author: 'AI Research Team',
      date: '2025-01-08',
      readTime: '10 min read',
      tags: ['ai'],
      featured: false,
      image: '/api/placeholder/600/400'
    },
    {
      id: 5,
      slug: 'new-features-advanced-analytics-dashboard-released',
      title: 'New Features: Advanced Analytics Dashboard Released',
      excerpt: 'Introducing our new analytics dashboard with real-time insights, custom reports, and performance metrics.',
      author: 'Product Team',
      date: '2025-01-05',
      readTime: '4 min read',
      tags: ['updates'],
      featured: false,
      image: '/api/placeholder/600/400'
    },
    {
      id: 6,
      slug: 'building-your-first-e-commerce-chatbot-beginners-guide',
      title: 'Building Your First E-commerce Chatbot: A Beginner\'s Guide',
      excerpt: 'Everything you need to know to create and deploy your first e-commerce chatbot from scratch.',
      author: 'Technical Team',
      date: '2025-01-03',
      readTime: '15 min read',
      tags: ['tutorials'],
      featured: false,
      image: '/api/placeholder/600/400'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Live Chat Widget */}
      <LiveChatWidget />
      
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Orchestrator Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tutorials, and updates on AI-powered customer service and chatbot technology.
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedTag === tag.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{tag.count}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Get the latest blog posts and updates delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && selectedTag === 'all' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Post</h2>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-3">
                        {tags.find(t => t.id === featuredPost.tags[0])?.name}
                      </span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{new Date(featuredPost.date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <h3 onClick={() => navigate(`/blog/${featuredPost.slug}`)} className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">{featuredPost.author}</span>
                      </div>
                      <button onClick={() => navigate(`/blog/${featuredPost.slug}`)} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No additional posts yet */}

            {regularPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse different categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest AI insights, tutorials, and product updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 AI Orchestrator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;




