'use client';
import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetTokenComp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/generate_password_reset_token/', { email });
            setMessage(response.data.message);
        } catch (err: any) {
            if (err.response) {
                // Request made and server responded
                setError(err.response.data.error);
            } else if (err.request) {
                // The request was made but no response was received
                setError('No response from server');
            } else {
                // Something happened in setting up the request
                setError(err.message);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <div className="w-full max-w-md p-6 border-2 border-gray rounded-lg shadow-lg bg-white">
                <h2 className="text-xl font-bold mb-4 text-center">Password Reset</h2>
                <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md mb-4">
                    <p className="text-yellow-800">
                        Forgotten your password? Enter your e-mail address below, and we will send you an e-mail allowing you to reset it.
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Reset my password
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default PasswordResetTokenComp;
