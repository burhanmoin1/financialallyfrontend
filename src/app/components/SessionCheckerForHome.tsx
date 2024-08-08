'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ActivationRedirect from './ActivationRedirect';
import { useRouter } from 'next/navigation';
import LoggedInHeader from './LoggedInHeader';
import TextSummarization from './TextSummarization';
import TextSummaries from './TextSummaries';

const SessionCheckerForHome: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('home');
  
  const signOut = () => {
    // Remove cookies
    Cookies.remove('user_email');
    Cookies.remove('session_token');
    Cookies.remove('name');
    // Refresh the page
    window.location.reload();
  };

  useEffect(() => {
    const checkSession = async () => {
      // Retrieve email and session token from cookies
      const email = Cookies.get('user_email');
      const session_token = Cookies.get('session_token');
      const name = Cookies.get('name');

      if (!email || !session_token) {
        setLoading(false);
        return;
      }

      try {
        // Send a POST request to the session checker API
        const response = await axios.post('http://127.0.0.1:8000/api/user_session_checker/', { email, session_token });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserName(name || '');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {isAuthenticated ? (
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg text-center">
          <ActivationRedirect />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {userName}</h2>
          <div>
          <LoggedInHeader setActiveTab={setActiveTab} />
          <main className="p-6">
            {activeTab === 'home' && (
              <div>Welcome to the Home page!</div>
            )}
            {activeTab === 'text-summary' && (
              <TextSummarization />
            )}
            {activeTab === 'summaries' && (
              <TextSummaries />
            )}
          </main>
        </div>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Chord Site: A Smart Speech Generator</h2>
          <p className="text-gray-700 mb-4">Please log in to access this content.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionCheckerForHome;
