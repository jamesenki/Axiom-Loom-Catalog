import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DynamicApiButtons } from './DynamicApiButtons';
import { ArrowLeft, Folder, GitBranch, Calendar, Info } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

interface Repository {
  name: string;
  description?: string;
  language?: string;
  topics?: string[];
  updated_at?: string;
  default_branch?: string;
  stargazers_count?: number;
  forks_count?: number;
}

const RepositoryView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRepository = async () => {
      if (!repoName) return;
      
      try {
        setLoading(true);
        // Fetch repository details from API
        const response = await fetch(getApiUrl(`/api/repository/${repoName}`));
        if (response.ok) {
          const data = await response.json();
          setRepository(data);
        }
      } catch (error) {
        console.error('Error fetching repository:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepository();
  }, [repoName]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading repository details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/repositories" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Repositories
        </Link>
        
        {/* Repository Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Folder className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-3xl font-bold">{repoName}</h1>
            </div>
          </div>
          
          {repository && (
            <>
              {repository.description && (
                <p className="text-gray-300 mb-4">{repository.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {repository.language && (
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    {repository.language}
                  </div>
                )}
                {repository.default_branch && (
                  <div className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-1" />
                    {repository.default_branch}
                  </div>
                )}
                {repository.updated_at && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Last updated: {new Date(repository.updated_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {repository.topics && repository.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {repository.topics.map((topic, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-900 bg-opacity-30 text-blue-300 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Dynamic API Buttons */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Available API Tools
          </h2>
          {repoName && <DynamicApiButtons repositoryName={repoName} />}
        </div>
        
        {/* Documentation Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Documentation</h2>
          <div className="space-y-3">
            <Link 
              to={`/repository/${repoName}/docs`}
              className="block p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span>View Documentation</span>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
            <Link 
              to={`/repository/${repoName}/readme`}
              className="block p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span>README.md</span>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryView;
