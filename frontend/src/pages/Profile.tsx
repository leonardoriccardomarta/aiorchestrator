import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Profile: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    title: 'Product Manager',
    company: 'TechCorp Solutions',
    about: 'Experienced product manager passionate about AI and customer experience. Leading digital transformation initiatives and building innovative chatbot solutions that drive business growth.',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinedDate: 'January 2024',
    website: 'https://sarahjohnson.dev',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    timezone: 'Pacific Time (UTC-8)',
    language: 'English'
  });
  const [skills, setSkills] = useState([
    'Product Management', 'AI Strategy', 'Customer Experience', 
    'Data Analysis', 'Team Leadership', 'Agile Methodology',
    'User Research', 'A/B Testing', 'Strategic Planning'
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [achievements] = useState([
    {
      title: 'AI Innovation Award',
      description: 'Led the development of award-winning chatbot platform',
      date: '2024',
      icon: '🏆'
    },
    {
      title: 'Team Excellence',
      description: 'Built and managed high-performing product team',
      date: '2023',
      icon: '👥'
    },
    {
      title: 'Customer Success Champion',
      description: 'Achieved 95%+ customer satisfaction scores',
      date: '2023',
      icon: ''
    }
  ]);

  const [stats] = useState({
    chatbotsCreated: 12,
    totalMessages: 45678,
    avgSatisfaction: 94.5,
    integrations: 8
  });

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    // Show success message
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Enhanced Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-64 w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute top-4 right-4">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                📷 Change Cover
              </Button>
            </div>
          </div>
          
          {/* Profile Info Overlay */}
          <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="h-32 w-32 rounded-xl bg-white shadow-xl overflow-hidden border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=128&h=128&fit=crop&crop=face"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors shadow-lg">
                <span className="text-sm">📷</span>
              </button>
            </div>
            
            {/* Basic Info */}
            <div className="mb-4 text-white">
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="text-xl opacity-90">{profileData.title}</p>
              <p className="text-lg opacity-75">{profileData.company}</p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute top-4 left-4">
            <Button
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              variant={isEditing ? "success" : "outline"}
              className={isEditing ? "" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
              leftIcon={<span>{isEditing ? "💾" : "✏️"}</span>}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-3xl mb-2"></div>
            <div className="text-2xl font-bold text-gray-900">{stats.chatbotsCreated}</div>
            <div className="text-sm text-gray-500">Chatbots Created</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Messages</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-3xl mb-2">😊</div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgSatisfaction}%</div>
            <div className="text-sm text-gray-500">Avg Satisfaction</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-gray-900">{stats.integrations}</div>
            <div className="text-sm text-gray-500">Integrations</div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>👤</span>
                  <span>About</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={profileData.title}
                          onChange={(e) => handleProfileChange('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                      <textarea
                        rows={4}
                        value={profileData.about}
                        onChange={(e) => handleProfileChange('about', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{profileData.about}</p>
                )}

                {/* Contact Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📧</span>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-700">{profileData.email}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg"></span>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-700">{profileData.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📍</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleProfileChange('location', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-700">{profileData.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg"></span>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => handleProfileChange('website', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {profileData.website}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">💼</span>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileData.linkedin}
                          onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📅</span>
                      <span className="text-gray-700">Joined {profileData.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span></span>
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Created new chatbot', target: 'Customer Support Bot v2', time: '2 hours ago', icon: '' },
                    { action: 'Updated integration', target: 'WhatsApp Business API', time: '1 day ago', icon: '🔗' },
                    { action: 'Analyzed performance', target: 'Sales Assistant metrics', time: '2 days ago', icon: '' },
                    { action: 'Added FAQ entries', target: '15 new customer questions', time: '3 days ago', icon: '❓' },
                    { action: 'Team collaboration', target: 'Shared dashboard with marketing team', time: '1 week ago', icon: '👥' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.target}</div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Skills & Achievements */}
          <div className="space-y-8">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span></span>
                    <span>Skills</span>
                  </div>
                  {isEditing && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add skill..."
                        className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button size="sm" onClick={handleAddSkill} leftIcon={<span>➕</span>}>
                        Add
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`group relative px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        isEditing 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer' 
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏆</span>
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    {isEditing ? (
                      <select 
                        value={profileData.language}
                        onChange={(e) => handleProfileChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    ) : (
                      <div className="text-gray-700">{profileData.language}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    {isEditing ? (
                      <select 
                        value={profileData.timezone}
                        onChange={(e) => handleProfileChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Pacific Time (UTC-8)</option>
                        <option>Mountain Time (UTC-7)</option>
                        <option>Central Time (UTC-6)</option>
                        <option>Eastern Time (UTC-5)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    ) : (
                      <div className="text-gray-700">{profileData.timezone}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 