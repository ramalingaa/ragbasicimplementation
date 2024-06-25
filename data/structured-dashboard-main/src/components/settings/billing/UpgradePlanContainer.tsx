import { useState, useEffect } from 'react';

export default function UpgradePlanContainer() {
  // Assuming the use of an environment variable and a mock function for demonstration
  const planId = process.env.NEXT_PUBLIC_GROWTH_PLAN_ID as string;

  const redirectToPlanCheckout = (planId: string) => {};

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col p-5 rounded-md w-full bg-white">
      <h2 className="text-lg mb-5">Growth</h2>
      <p className="text-sm text-gray-600">
        Elevate your experience with the Growth Tier: Get advanced, customizable
        API generation, create up to 50 APIs, enjoy 10,000 monthly calls, direct
        email support for quick responses, and advanced analytics with 10GB data
        retention.
      </p>
      <a
        href="https://www.structuredlabs.io/#Pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600"
      >
        Read more
      </a>
      <hr className="my-4 w-full" />
      <button
        className={`px-4 py-2 text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} rounded-md`}
        onClick={() => redirectToPlanCheckout(planId)}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Upgrade'}
      </button>
    </div>
  );
}
