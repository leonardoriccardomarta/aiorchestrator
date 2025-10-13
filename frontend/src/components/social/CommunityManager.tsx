import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { socialProofService } from '../../services/social/SocialProofService';

const CommunityManager: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [communities, setCommunities] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: [''],
    communityId: ''
  });

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setIsLoading(true);
    try {
      const communitiesData = socialProofService.getCommunities();
      const postsData = socialProofService.getCommunityPosts();
      setCommunities(communitiesData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.communityId) return;

    const post = socialProofService.createCommunityPost({
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags.filter(tag => tag.trim() !== ''),
      communityId: newPost.communityId,
      authorId: 'current-user-id',
      authorName: 'Current User'
    });

    setPosts([...posts, post]);
    setShowCreateForm(false);
    setNewPost({
      title: '',
      content: '',
      tags: [''],
      communityId: ''
    });
  };

  const handleUpdateTags = (index: number, value: string) => {
    const updatedTags = [...newPost.tags];
    updatedTags[index] = value;
    setNewPost({ ...newPost, tags: updatedTags });
  };

  const handleAddTag = () => {
    setNewPost({ ...newPost, tags: [...newPost.tags, ''] });
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = newPost.tags.filter((_, i) => i !== index);
    setNewPost({ ...newPost, tags: updatedTags });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat().format(date);
  };

  const renderOverviewTab = () => (
    <div>
      <h2>Community Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Communities</h3>
          <div className="metric-value">{communities.length}</div>
        </div>
        <div className="metric-card">
          <h3>Total Posts</h3>
          <div className="metric-value">{formatNumber(posts.length)}</div>
        </div>
        <div className="metric-card">
          <h3>Active Users</h3>
          <div className="metric-value">{formatNumber(communities.reduce((sum, c) => sum + (c.memberCount || 0), 0))}</div>
        </div>
        <div className="metric-card">
          <h3>Engagement Rate</h3>
          <div className="metric-value">85.2%</div>
        </div>
      </div>
    </div>
  );

  const renderCommunitiesTab = () => (
    <div>
      <h2>Communities</h2>
      <div className="communities-list">
        {communities.map(community => (
          <div key={community.id} className="community-card">
            <h3>{community.name}</h3>
            <p>{community.description}</p>
            <div className="community-stats">
              <div className="stat">
                <span>Members:</span>
                <span>{formatNumber(community.memberCount || 0)}</span>
              </div>
              <div className="stat">
                <span>Posts:</span>
                <span>{formatNumber(community.postCount || 0)}</span>
              </div>
              <div className="stat">
                <span>Created:</span>
                <span>{formatDate(community.createdAt)}</span>
              </div>
            </div>
            <div className="community-actions">
              <button>View Community</button>
              <button>Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPostsTab = () => (
    <div>
      <div className="posts-header">
        <h2>Community Posts</h2>
        <button onClick={() => setShowCreateForm(true)}>Create Post</button>
      </div>

      {showCreateForm && (
        <div className="create-post-form">
          <h3>Create New Post</h3>
          <select
            value={newPost.communityId}
            onChange={(e) => setNewPost({ ...newPost, communityId: e.target.value })}
          >
            <option value="">Select Community</option>
            {communities.map(community => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Post Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <div className="tags-section">
            <h4>Tags</h4>
            {newPost.tags.map((tag, index) => (
              <div key={index} className="tag-input">
                <input
                  type="text"
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleUpdateTags(index, e.target.value)}
                />
                <button onClick={() => handleRemoveTag(index)}>Remove</button>
              </div>
            ))}
            <button onClick={handleAddTag}>Add Tag</button>
          </div>
          <div className="form-actions">
            <button onClick={handleCreatePost}>Create Post</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="post-meta">
              <span>Community: {communities.find(c => c.id === post.communityId)?.name}</span>
              <span>Author: {post.authorName}</span>
              <span>Created: {formatDate(post.createdAt)}</span>
            </div>
            <div className="post-tags">
              {post.tags.map((tag: string, index: number) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <div className="post-actions">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading community data...</div>;
  }

  return (
    <div className="community-manager">
      <div className="manager-header">
        <h1>Community Manager</h1>
        <p>Manage communities and user-generated content</p>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'communities' ? 'active' : ''}`}
          onClick={() => setActiveTab('communities')}
        >
          Communities
        </button>
        <button
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'communities' && renderCommunitiesTab()}
        {activeTab === 'posts' && renderPostsTab()}
      </div>
    </div>
  );
};

export default CommunityManager; 