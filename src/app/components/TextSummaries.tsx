import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Summary {
  id: string;
  summary: string;
  created_at: string;
}

const TextSummaries: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve user_id from cookie
  const userId = Cookies.get('user_id');

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!userId) {
        setError('User ID is not available.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/text-summarization-history/?user_id=${userId}`);
        setSummaries(response.data);
      } catch (err) {
        setError('Failed to fetch summaries.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [userId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Text Summarization History</h2>
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-200 border-solid rounded-full animate-spin"></div>
          <p>Loading summaries...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 border border-red-500 text-red-500 rounded-md">
          <p>{error}</p>
        </div>
      ) : summaries.length > 0 ? (
        <ul>
          {summaries.map(summary => (
            <li key={summary.id} className="mb-4 p-4 border border-gray-300 rounded-md">
              <p>{summary.summary}</p>
              <small className="text-gray-500">{new Date(summary.created_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No summaries found.</p>
      )}
    </div>
  );
};

export default TextSummaries;
