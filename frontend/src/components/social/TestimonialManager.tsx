import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { socialProofService } from '../../services/social/SocialProofService';

const TestimonialManager: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    title: '',
    content: '',
    authorName: '',
    authorRole: '',
    company: '',
    rating: 5,
    category: 'general'
  });

  useEffect(() => {
    loadTestimonialData();
  }, []);

  const loadTestimonialData = async () => {
    setIsLoading(true);
    try {
      const testimonialsData = socialProofService.getTestimonials();
      const reviewsData = socialProofService.getReviews();
      setTestimonials(testimonialsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading testimonial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestimonial = () => {
    if (!newTestimonial.title || !newTestimonial.content || !newTestimonial.authorName) return;

    const testimonial = socialProofService.createTestimonialSimple({
      title: newTestimonial.title,
      content: newTestimonial.content,
      authorName: newTestimonial.authorName,
      authorRole: newTestimonial.authorRole,
      company: newTestimonial.company,
      rating: newTestimonial.rating,
      category: newTestimonial.category
    });

    setTestimonials([...testimonials, testimonial]);
    setShowCreateForm(false);
    setNewTestimonial({
      title: '',
      content: '',
      authorName: '',
      authorRole: '',
      company: '',
      rating: 5,
      category: 'general'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat().format(date);
  };

  const renderOverviewTab = () => (
    <div>
      <h2>Testimonial Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Testimonials</h3>
          <div className="metric-value">{testimonials.length}</div>
        </div>
        <div className="metric-card">
          <h3>Total Reviews</h3>
          <div className="metric-value">{formatNumber(reviews.length)}</div>
        </div>
        <div className="metric-card">
          <h3>Average Rating</h3>
          <div className="metric-value">
            {reviews.length > 0 
              ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
              : '0.0'
            }
          </div>
        </div>
        <div className="metric-card">
          <h3>Featured Testimonials</h3>
          <div className="metric-value">{testimonials.filter(t => t.featured).length}</div>
        </div>
      </div>
    </div>
  );

  const renderTestimonialsTab = () => (
    <div>
      <div className="testimonials-header">
        <h2>Testimonials</h2>
        <button onClick={() => setShowCreateForm(true)}>Create Testimonial</button>
      </div>

      {showCreateForm && (
        <div className="create-testimonial-form">
          <h3>Create New Testimonial</h3>
          <input
            type="text"
            placeholder="Testimonial Title"
            value={newTestimonial.title}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
          />
          <textarea
            placeholder="Testimonial Content"
            value={newTestimonial.content}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author Name"
            value={newTestimonial.authorName}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, authorName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author Role"
            value={newTestimonial.authorRole}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, authorRole: e.target.value })}
          />
          <input
            type="text"
            placeholder="Company"
            value={newTestimonial.company}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
          />
          <select
            value={newTestimonial.category}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, category: e.target.value })}
          >
            <option value="general">General</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
            <option value="support">Support</option>
          </select>
          <div className="rating-input">
            <label>Rating:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={newTestimonial.rating}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleCreateTestimonial}>Create Testimonial</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="testimonials-list">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <h3>{testimonial.title}</h3>
            <p>{testimonial.content}</p>
            <div className="testimonial-meta">
              <div className="author-info">
                <span className="author-name">{testimonial.authorName}</span>
                <span className="author-role">{testimonial.authorRole}</span>
                <span className="company">{testimonial.company}</span>
              </div>
              <div className="rating">
                {''.repeat(testimonial.rating || 0)}
              </div>
            </div>
            <div className="testimonial-category">
              <span className="category-tag">{testimonial.category}</span>
            </div>
            <div className="testimonial-actions">
              <button>Edit</button>
              <button>Delete</button>
              <button>{testimonial.featured ? 'Unfeature' : 'Feature'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div>
      <h2>Customer Reviews</h2>
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.title}</h3>
              <div className="rating">{''.repeat(review.rating || 0)}</div>
            </div>
            <p>{review.content}</p>
            <div className="review-meta">
              <span>By: {review.authorName}</span>
              <span>Date: {formatDate(review.createdAt)}</span>
            </div>
            <div className="review-actions">
              <button>Approve</button>
              <button>Reject</button>
              <button>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading testimonial data...</div>;
  }

  return (
    <div className="testimonial-manager">
      <div className="manager-header">
        <h1>Testimonial Manager</h1>
        <p>Manage customer testimonials and reviews</p>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'testimonials' && renderTestimonialsTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </div>
    </div>
  );
};

export default TestimonialManager; 