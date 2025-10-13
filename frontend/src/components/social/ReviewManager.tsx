import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { socialProofService, ReviewType } from '../../services/social/SocialProofService';

const ReviewManager: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    authorName: '',
    rating: 5,
    type: ReviewType.VERIFIED,
    category: 'general'
  });

  useEffect(() => {
    loadReviewData();
  }, []);

  const loadReviewData = async () => {
    setIsLoading(true);
    try {
      const reviewsData = socialProofService.getReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = () => {
    if (!newReview.title || !newReview.content || !newReview.authorName) return;

    const review = socialProofService.createReview({
      title: newReview.title,
      content: newReview.content,
      author: {
        name: newReview.authorName,
        email: 'user@example.com',
        verified: false
      },
      rating: newReview.rating,
      type: newReview.type,
      tags: [newReview.category],
      status: 'pending',
      metadata: {}
    });

    setReviews([...reviews, review]);
    setShowCreateForm(false);
    setNewReview({
      title: '',
      content: '',
      authorName: '',
      rating: 5,
              type: ReviewType.CUSTOMER,
      category: 'general'
    });
  };



  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat().format(date);
  };

  const renderOverviewTab = () => (
    <div>
      <h2>Review Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Reviews</h3>
          <div className="metric-value">{reviews.length}</div>
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
          <h3>Verified Reviews</h3>
          <div className="metric-value">{reviews.filter(r => r.type === ReviewType.VERIFIED).length}</div>
        </div>
        <div className="metric-card">
          <h3>Pending Reviews</h3>
          <div className="metric-value">{reviews.filter(r => r.status === 'pending').length}</div>
        </div>
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div>
      <div className="reviews-header">
        <h2>Reviews</h2>
        <button onClick={() => setShowCreateForm(true)}>Create Review</button>
      </div>

      {showCreateForm && (
        <div className="create-review-form">
          <h3>Create New Review</h3>
          <input
            type="text"
            placeholder="Review Title"
            value={newReview.title}
            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
          />
          <textarea
            placeholder="Review Content"
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author Name"
            value={newReview.authorName}
            onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
          />
          <select
            value={newReview.type}
            onChange={(e) => setNewReview({ ...newReview, type: e.target.value as ReviewType })}
          >
            <option value={ReviewType.CUSTOMER}>Customer</option>
            <option value={ReviewType.VERIFIED}>Verified</option>
            <option value={ReviewType.EXPERT}>Expert</option>
          </select>
          <select
            value={newReview.category}
            onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
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
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleCreateReview}>Create Review</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.title}</h3>
              <div className="rating">{''.repeat(review.rating || 0)}</div>
            </div>
            <p>{review.content}</p>
            <div className="review-meta">
              <div className="author-info">
                <span className="author-name">{review.authorName}</span>
                <span className="review-type">{review.type}</span>
                <span className="category">{review.category}</span>
              </div>
              <div className="review-date">
                <span>Created: {formatDate(review.createdAt)}</span>
              </div>
            </div>
            <div className="review-actions">
              <button>Approve</button>
              <button>Reject</button>
              <button>Reply</button>
              <button>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div>
      <h2>Review Analytics</h2>
      <div className="analytics-grid">
        <div className="chart-container">
          <h3>Rating Distribution</h3>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length * 100).toFixed(1) : '0';
              return (
                <div key={rating} className="rating-bar">
                  <span>{rating}</span>
                  <div className="bar">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span>{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="chart-container">
          <h3>Review Types</h3>
          <div className="type-distribution">
            <div className="type-item">
              <span>General</span>
                             <span>{reviews.filter(r => r.type === ReviewType.CUSTOMER).length}</span>
             </div>
             <div className="type-item">
               <span>Verified</span>
               <span>{reviews.filter(r => r.type === ReviewType.VERIFIED).length}</span>
             </div>
             <div className="type-item">
               <span>Expert</span>
               <span>{reviews.filter(r => r.type === ReviewType.EXPERT).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading review data...</div>;
  }

  return (
    <div className="review-manager">
      <div className="manager-header">
        <h1>Review Manager</h1>
        <p>Manage customer reviews and ratings</p>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default ReviewManager; 