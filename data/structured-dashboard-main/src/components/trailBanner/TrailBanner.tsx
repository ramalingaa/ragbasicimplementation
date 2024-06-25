import { useAuthStore } from 'zustand/auth/authStore';
import React from 'react';

const TrialBanner: React.FC = () => {
    // Placeholder for days left, you might want to calculate this dynamically
    const daysLeft: number = 13;

    const { user } = useAuthStore();
    // if user's email domain is structuredlabs.io, return null
    const showTrialBanner = !user?.email?.endsWith('structuredlabs.io')

    return (
        <>
            <div className={`${showTrialBanner ? 'flex' : 'hidden'} flex-col justify-between items-center bg-white rounded-lg shadow-lg px-2 py-1 h-14 text-xs mb-4`}>
                {/* Days left on trial */}
                <div className="flex items-center space-x-2 w-3/4">
                    <div className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-md w-4 h-4">
                        {daysLeft}
                    </div>
                    <span className="text-xs font-medium text-gray-800">
                        {daysLeft === 1 ? 'day' : 'days'} left on trial
                    </span>
                </div>

                {/* Add billing button */}
                <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-1 py-1 text-center text-xs w-full">
                    Contact Sales
                </button>
            </div>
            <div className={`border-t border-gray-200 my-4 ${showTrialBanner ? 'flex' : 'hidden'}`} /></>
    );
};

export default TrialBanner;
