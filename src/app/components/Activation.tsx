'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Activation() {
    const { activation_token } = useParams();
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const router = useRouter(); 

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/check-token-validity/${activation_token}/`);
                
                if (response.status === 200 && response.data.valid) {
                    setStatus('valid');
                    setMessage(response.data.message);
                } else {
                    setStatus('invalid');
                    setMessage(response.data.message);
                }
            } catch (error) {
                console.error("Error during fetch: ", error);
                setStatus('error');
                setMessage('An error occurred. Please contact us for support.');
            }
        };

        checkTokenValidity();
    }, [activation_token]);

    const verifyAccount = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/verify/${activation_token}/`);
            
            if (response.status === 200) {
                setStatus('success');
                setMessage(response.data.message);
                router.push('/?account_activated=true');
            } else {
                setStatus('error');
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error during activation: ", error);
            setStatus('error');
            setMessage('An error occurred. Please contact us for support.');
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-xl font-semibold mb-4">{message}</h1>
            {status === 'valid' && (
                <button 
                    onClick={verifyAccount} 
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
                >
                    Verify Account
                </button>
            )}
            {status === 'success' && (
                <p className="text-green-600 mt-4">You can now log in with your account.</p>
            )}
        </div>
    );
}
