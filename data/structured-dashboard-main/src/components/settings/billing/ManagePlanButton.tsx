import React from 'react';

const ManagePlanButton = () => {
  const redirectToCustomerPortal = () => {
    window.location.href = 'mailto:sales@structuredlabs.io';
  };

  const isLoading = false;
  const error = '';

  return (
    <>
      <div className="group relative">
        <button
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} w-full`}
          onClick={redirectToCustomerPortal}
          disabled={isLoading}
        >
          Upgrade
        </button>
        {/* Adjusted tooltip positioning */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-24 bg-black text-white text-xs py-2 px-4 rounded-lg shadow-md z-10 mt-2 invisible group-hover:visible min-w-max">
          To upgrade email sales@structuredlabs.io
        </div>
      </div>
      {error && (
        <div className="bg-red-500 text-white font-bold p-4 rounded-lg mt-4 mb-8 flex items-center">
          <span>Error:</span> {error}
        </div>
      )}
    </>
  );
};

export default ManagePlanButton;
