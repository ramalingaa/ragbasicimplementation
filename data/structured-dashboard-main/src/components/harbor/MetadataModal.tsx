'use client';

import React, { useEffect, useRef } from 'react';

import { DataSource } from 'interfaces/DataTypes';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDataSource: DataSource | null;
}

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDataSource: DataSource | null;
}

const MetadataModal: React.FC<MetadataModalProps> = ({
  isOpen,
  onClose,
  selectedDataSource,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const overlayStyle: React.CSSProperties = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#fefefe',
    margin: '10% auto',
    width: '40%',
    border: '1px solid #888',
    borderRadius: '10px',
    zIndex: 11,
    padding: '20px',
    position: 'relative',
  };



  return (
    <div style={overlayStyle}>
      <div ref={modalRef} style={contentStyle}>
        
      </div>
    </div>
  );
};


export default MetadataModal;
