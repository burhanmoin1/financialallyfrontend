'use client';
import { useSearchParams } from 'next/navigation';

export default function ActivationRedirect() {
    const searchParams = useSearchParams();
    const accountAlreadyActivated = searchParams.get('account_activated'); // Get the message from query parameters

    return (
        <div className="flex flex-col">
            {accountAlreadyActivated === 'true' && (
                <div className="p-4 pr-10 pl-10 border-2 border-green-500 rounded-md text-center">
                    <h2 className="text-xl font-bold mb-2">CONGRATULATIONS</h2>
                    <p className="w-[70vmin] text-gray-700">
                        Thank you for confirming your email address. You can continue using our services.
                    </p>
                </div>
            )}
        </div>
    );
}
