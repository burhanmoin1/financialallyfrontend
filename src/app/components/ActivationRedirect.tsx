'use client';
import { useSearchParams } from 'next/navigation';

export default function ActivationRedirect() {
    const searchParams = useSearchParams();
    const accountAlreadyActivated = searchParams.get('account_activated'); // Get the message from query parameters

    return (
        <div className="flex flex-col">
            {accountAlreadyActivated === 'true' && (
                <div className="p-4 border-2 border-green-500 rounded-md text-center">
                    <h2 className="text-xl font-bold mb-2">CONGRATULATIONS</h2>
                    <p className=" text-gray-700">
                        Thank you for confirming your email address. You can now continue using our services.
                    </p>
                </div>
            )}
        </div>
    );
}
