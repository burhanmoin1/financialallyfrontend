'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Activation() {
    const { activation_token } = useParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/verify/${activation_token}/`);
                
                if (response.status === 200) {
                    setStatus('success');
                    setMessage('Your account has been activated successfully!');
                } else if (response.status === 400) {
                    setStatus('error');
                    setMessage('Account already activated.');
                    router.push('/?account_activated=true'); 
                } else if (response.status === 404) {
                    setStatus('error');
                    setMessage('Activation token is not valid');
                }
            } catch (error) {
                console.error("Error during fetch: ", error);
                setStatus('error');
                setMessage('An error occurred. Please contact us for support');
            }
        };

        verifyToken();
    }, [activation_token, router]); 

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{message}</h1>
            {status === 'success' && (
                <p>You can now log in with your account.</p>
            )}
        </div>
    );
}
