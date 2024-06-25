import React from 'react';

interface ErrorCardProps {
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center text-sm px-4 py-2 rounded-md bg-red-100 text-red-800 border-red-300 border-[1px] border-md mt-4 shadow-md">
      {message}
    </div>
  );
};

export default ErrorCard;
