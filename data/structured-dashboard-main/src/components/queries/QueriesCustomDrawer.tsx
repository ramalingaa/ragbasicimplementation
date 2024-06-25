import React from 'react';

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueriesCustomDrawer: React.FC<CustomDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1200,
    display: isOpen ? 'block' : 'none',
  };

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100%',
    background: 'white',
    zIndex: 1300,
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={drawerStyle}>
        <div className='flex flex-col p-4 h-full'>
          <span className='text-sm'>Data Preview</span>
          <button className='mb-4' onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default QueriesCustomDrawer;
