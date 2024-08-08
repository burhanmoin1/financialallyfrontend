'use client';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const UserAccountLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/loginuser/', { email, password });
      const { name, user_email, session_token, user_id } = response.data;

      Cookies.set('name', name, { expires: 7 });
      console.log('Name:', name);
      
      Cookies.set('user_email', user_email, { expires: 7 });
      console.log('User Email:', user_email);
      
      Cookies.set('session_token', session_token, { expires: 7 });
      console.log('Session Token:', session_token);

      Cookies.set('user_id', user_id, { expires: 7 });
      console.log('User ID:', user_id);

      // Redirect to home page
      router.push('/');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
            />
          </div>
          <div className="mt-4">
              <a
                href="/password-reset"
                className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Forgot Password?
              </a>
            </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
          <a
                href="/signup"
                className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Do not have an account? Sign up instead
              </a>
        </div>
      </div>
    </div>
  );
};

export default UserAccountLogin;
