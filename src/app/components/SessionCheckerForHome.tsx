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
    <div>
      {isAuthenticated ? (
        <div>
          <ActivationRedirect />
          <div>
          <LoggedInHeader setActiveTab={setActiveTab} />
          <main className="p-6">
            {activeTab === 'home' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {userName}</h2>
                <p>Check out one of our services from the above list</p>
              </div>
              
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
        <div className="grid grid-cols-3 grid-rows-2 gap-0">
        <div className="col-span-2 row-span-2 p-4 bg-blue-200">
          Actual content 1
        </div>
        <div className="col-span-2 row-span-2 p-4 bg-green-200">
          Actual content 2
        </div>
      </div>
      )}
    </div>
  );
};

export default SessionCheckerForHome;
