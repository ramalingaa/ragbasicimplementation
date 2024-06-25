'use client';
import { ReactNode } from 'react';

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className='flex flex-row w-full gap-x-1'
      style={{
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
