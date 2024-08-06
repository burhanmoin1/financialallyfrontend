'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const PasswordResetComp: React.FC = () => {
    const { reset_token } = useParams();
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Validate the token on component mount
        const validateToken = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/validate_token/${reset_token}/`);
                setIsTokenValid(response.data.valid);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    // Handle known Axios error
                    setIsTokenValid(false);
                    setError(err.response?.data?.error || 'An error occurred');
                } else {
                    // Handle unknown error
                    setIsTokenValid(false);
                    setError('An error occurred');
                }
            }
        };

        validateToken();
    }, [reset_token]);

    const validatePassword = (password: string, confirmPassword: string): boolean => {
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            return false;
        }
        if (!/[!@#$%^&*()_+.]/.test(password)) {
            setPasswordError("Password must contain at least one special character.");
            return false;
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validatePassword(password, confirmPassword)) {
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/reset_password/${reset_token}/`, {
                password: password
            });
            setMessage(response.data.message);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Handle known Axios error
                setError(err.response?.data?.error || 'An error occurred');
            } else {
                // Handle unknown error
                setError('An error occurred');
            }
        }
    };

    if (isTokenValid === null) {
        return <p>Loading...</p>;
    }

    if (isTokenValid === false) {
        return <p>{error || 'Invalid or expired token'}</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirm_password" className="block text-gray-700 text-sm font-bold mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                {passwordError && <p className="text-red-600 mb-4">{passwordError}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Reset Password
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default PasswordResetComp;
