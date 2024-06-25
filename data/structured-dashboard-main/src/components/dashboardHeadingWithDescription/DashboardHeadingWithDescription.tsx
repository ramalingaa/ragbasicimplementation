import React from 'react';

interface DashboardHeadingWithDescriptionProps {
  headingText: string;
  headingEmoji?: string;
  descriptionText?: string;
  hasDescription?: boolean;
  linkText?: string;
  showLink: boolean;
  linkProps?: {
    as: React.ElementType;
    href: string;
    isExternal: boolean;
  };
  isComingSoon?: boolean;
}

export default function DashboardHeadingWithDescription({
  headingText,
  headingEmoji,
  descriptionText,
  hasDescription,
  linkText,
  showLink,
  linkProps,
  isComingSoon,
}: DashboardHeadingWithDescriptionProps) {

  return (
    <div className="flex flex-col align-start mb-4 w-full">
      <div className="flex items-center mb-2 text-left">
        {headingEmoji && (
          <>
            <span>{headingEmoji}</span>&nbsp;&nbsp;
          </>
        )}
        <h3 className="text-lg">{headingText}</h3>
        {isComingSoon && (
          <span className="ml-2 bg-green-100 text-green-800 py-1 px-2 rounded font-semibold text-xs uppercase">Coming soon!</span>
        )}
      </div>

      {hasDescription && (
        <div className="flex flex-col align-start">
          <hr className="w-full mt-2 mb-2" />
          <p className="text-left text-sm text-gray-700">
            {descriptionText}
            {showLink && (
              <a href={linkProps.href} className="text-black">
                {' '}
                {linkText}{' '}
              </a>
            )}
          </p>
          <hr className="w-full mb-2 mt-2" />
        </div>
      )}
    </div>

  );
}
