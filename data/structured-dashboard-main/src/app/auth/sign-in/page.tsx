'use client';

import React from 'react';

export default function SignIn() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const handleSignIn = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/api/auth/login';
    }
  };

  const handleSignUp = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/api/auth/signup';
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white w-full">
      <img src="/img/structured_logo_transparent_bg.png" alt="Structured Logo" className="max-w-[25%] max-h-[25%]" />
      <div className="flex gap-2 w-[20vw] justify-center flex-col lg:flex-row">
        <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 rounded-md w-fill-available" onClick={handleSignIn}>
          Log In
        </button>
        <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 rounded-md w-fill-available" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );

}
