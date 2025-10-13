import React, { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentationService, DocumentationArticle, DocumentationType, InteractiveTutorial, VideoTutorial, CertificationProgram } from '../services/documentation/DocumentationService';

const Documentation: FC = () => {
  const [docService] = useState(() => new DocumentationService());
  const [articles, setArticles] = useState<DocumentationArticle[]>([]);
  const [tutorials, setTutorials] = useState<InteractiveTutorial[]>([]);
  const [_videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [certificationPrograms, setCertificationPrograms] = useState<CertificationProgram[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<DocumentationArticle | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<InteractiveTutorial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentationType | 'all'>('all');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    // Load documentation data
    loadDocumentationData();
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDownload = (type: string) => {
    // Handle download logic
    console.log(`Downloading ${type} documentation`);
  };

  const loadDocumentationData = async () => {
    try {
      setLoading(true);
      const allArticles = Array.from(docService['articles'].values());
      const allTutorials = docService.getAllInteractiveTutorials();
      const allVideos = docService.getAllVideoTutorials();
      setVideoTutorials(allVideos);
      const allCertifications = docService.getAllCertificationPrograms();
      const analytics = docService.getDocumentationAnalytics();
      
      setArticles(allArticles);
      setTutorials(allTutorials);
      setVideoTutorials(allVideos);
      setCertificationPrograms(allCertifications);
      setAnalytics(analytics);
    } catch (error) {
      console.error('Error loading documentation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = () => {
    if (searchQuery.trim()) {
      const results = docService.searchArticles(searchQuery);
      setArticles(results);
    } else {
      loadDocumentationData();
    }
  };

  const filterByType = (type: DocumentationType | 'all') => {
    setSelectedType(type);
    if (type === 'all') {
      loadDocumentationData();
    } else {
      const filtered = docService.getArticlesByType(type);
      setArticles(filtered);
    }
  };

  const viewArticle = (article: DocumentationArticle) => {
    setSelectedArticle(article);
    docService.incrementViewCount(article.id);
  };

  const startTutorial = (tutorial: InteractiveTutorial) => {
    setSelectedTutorial(tutorial);
  };

  const enrollInCertification = (programId: string) => {
    const success = docService.enrollInCertification(programId, 'current-user-id');
    if (success) {
      // Refresh data
      loadDocumentationData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documentation & Training</h1>
          <p className="mt-2 text-gray-600">Learn how to use our platform effectively</p>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Articles</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalArticles}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.totalViews}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Tutorial Completions</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.tutorialCompletions}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
              <p className="text-3xl font-bold text-orange-600">{analytics.certificationEnrollments}</p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchArticles()}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => filterByType(e.target.value as DocumentationType | 'all')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {Object.values(DocumentationType).map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={searchArticles}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documentation Articles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Documentation Articles</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {articles.map(article => (
                  <div
                    key={article.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewArticle(article)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{article.content.substring(0, 150)}...</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {article.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {article.estimatedReadingTime} min read
                          </span>
                          <span className="text-sm text-gray-500">
                            {article.viewCount} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Tutorials and Certifications */}
          <div className="lg:col-span-1 space-y-6">
            {/* Interactive Tutorials */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Tutorials</h3>
              <div className="space-y-3">
                {tutorials.slice(0, 3).map(tutorial => (
                  <div
                    key={tutorial.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => startTutorial(tutorial)}
                  >
                    <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tutorial.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tutorial.difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {tutorial.estimatedDuration} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification Programs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification Programs</h3>
              <div className="space-y-3">
                {certificationPrograms.slice(0, 2).map(program => (
                  <div key={program.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900">{program.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        program.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        program.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {program.difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {program.duration} hours
                      </span>
                    </div>
                    <button
                      onClick={() => enrollInCertification(program.id)}
                      className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Article Detail Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedArticle.title}</h3>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {selectedArticle.estimatedReadingTime} min read
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedArticle.viewCount} views
                    </span>
                    <span className="text-sm text-gray-500">
                      Last updated: {new Date(selectedArticle.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Detail Modal */}
        {selectedTutorial && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedTutorial.title}</h3>
                  <button
                    onClick={() => setSelectedTutorial(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">{selectedTutorial.description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedTutorial.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-sm text-gray-600">{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Steps ({selectedTutorial.steps.length})</h4>
                  <div className="space-y-2">
                    {selectedTutorial.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-3 p-2 border rounded">
                        <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                        <span className="text-sm text-gray-900">{step.title}</span>
                        {step.completed && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedTutorial(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation; 