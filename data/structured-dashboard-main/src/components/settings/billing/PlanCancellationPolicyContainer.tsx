'use client';

import useThemeColors from 'hooks/useThemeColors';
import { useState } from 'react';
import { PiWarningCircleFill } from 'react-icons/pi';

export default function PlanCancellationPolicyContainer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { themeContainerBgColor, themeSecondaryTextColor } = useThemeColors();

  const policyPoints = [
    'Cancellation at Any Time: You can cancel your subscription at any time before the end of the current billing cycle to avoid future charges.',
    'No Long-Term Commitments: There are no cancellation fees, and you are not required to commit to a minimum term of service.',
    'End-of-Cycle Effectiveness: Upon cancellation, you will continue to have access to your tier features until the end of your current billing period.',
    "Auto-Renewal: For your convenience, all subscriptions auto-renew at the end of each billing cycle. You'll receive a reminder email before any renewal.",
    'Refunds: For monthly subscriptions, we do not offer refunds for partial months. For annual subscriptions, you may be eligible for a pro-rated refund for the unused portion of the service, at our discretion.',
    'Data Retention: After cancellation, your data will be retained for 30 days, during which you can reactivate your account if you choose. After this period, your data will be permanently deleted.',
    'How to Cancel: You can cancel your subscription directly through your account settings. If you need help or prefer to cancel through support, please contact us at contact@structuredlabs.io.',
  ];

  return (
    <div
      className='p-5 rounded-md w-full bg-yellow-50 flex flex-row items-center gap-x-2'
    >
        <PiWarningCircleFill className="text-yellow-400 text-4xl min-w-6 h-6" />
        <div className='flex flex-col'>
          <span className='text-gray-800'>
            <strong>Cancellation Policy:</strong> At Structured, we strive to
            create a transparent and hassle-free experience for all our users.
            Cancel Anytime.
          </span>
        </div>
    </div>
  );
}
