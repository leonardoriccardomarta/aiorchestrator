import React, { useMemo, useState } from 'react';
import { Calendar, User, ArrowRight, Search, Tag, Clock, Mail, CheckCircle2 } from 'lucide-react';                                                              
import LiveChatWidget from '../components/LiveChatWidget';
import { useNavigate } from 'react-router-dom';

const blogPosts = [
    {
      id: 1,
    slug: 'ai-chatbots-revolutionizing-customer-service-2025',
      title: 'How AI Chatbots Are Revolutionizing Customer Service in 2025',    
    excerpt: 'Discover the latest trends in AI-powered customer service and how businesses are using chatbots to improve customer satisfaction and reduce response times.',                                                                     
      author: 'AI Orchestrator Team',
      date: '2025-11-04',
      readTime: '8 min read',
    tags: ['ai', 'customer-service'],
      featured: true,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop'                                                                  
    }
  ];

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return [
      { id: 'all', name: 'All Posts', count: blogPosts.length },
      { id: 'ai', name: 'AI & ML', count: counts['ai'] || 0 },
      { id: 'tutorials', name: 'Tutorials', count: counts['tutorials'] || 0 },
      { id: 'case-studies', name: 'Case Studies', count: counts['case-studies'] || 0 },
      { id: 'updates', name: 'Updates', count: counts['updates'] || 0 }
  ];
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });
  }, [searchQuery, selectedTag]);

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || !featuredPost);

      const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('loading');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app';
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newsletterEmail })
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
      }

      // Reset status after 3 seconds
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LiveChatWidget />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Dashboard
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">    
            AI Orchestrator Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Insights, tutorials, and updates on AI-powered customer service and chatbot technology.                                                             
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-1">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTag === tag.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                      <span>{tag.name}</span>
                      <span className={`text-xs ${selectedTag === tag.id ? 'text-blue-600' : 'text-gray-400'}`}>
                        {tag.count}
                      </span>
                  </button>
                ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-3">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Newsletter</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Get weekly updates on AI, chatbots, and customer service trends.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === 'loading' && 'Subscribing...'}
                    {newsletterStatus === 'success' && (
                      <span className="flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Subscribed!
                      </span>
                    )}
                    {newsletterStatus === 'idle' && 'Subscribe'}
                    {newsletterStatus === 'error' && 'Try Again'}
                  </button>
                  {newsletterStatus === 'success' && (
                    <p className="text-xs text-green-600 text-center">Check your inbox for confirmation</p>
                  )}
                  {newsletterStatus === 'error' && (
                    <p className="text-xs text-red-600 text-center">Please enter a valid email</p>
                  )}
                </form>
              </div>
            </div>
          </aside>

          {/* Blog Posts */}
          <main className="lg:col-span-9">
            {/* Featured Post */}
            {featuredPost && selectedTag === 'all' && (
              <article className="mb-12 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop';
                    }}
                  />
                </div>
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mr-3">
                      Featured
                      </span>
                    <span className="flex items-center mr-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 
                    onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                    className="text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">{featuredPost.author}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Read article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                  </div>
                </div>
              </article>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regularPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span className="flex items-center mr-4">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                      </div>
                        <span className="text-blue-600 text-sm font-medium">
                          Read more →
                        </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or browse different categories.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Blog;




