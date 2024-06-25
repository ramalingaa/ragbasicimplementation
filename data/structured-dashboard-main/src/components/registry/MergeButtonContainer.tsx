import React from 'react';
import Card from 'components/card/Card';
import RegistryMergeModal from './RegistryMergeModal'; // Adjust the path as necessary
import useDisclosure from 'hooks/useDisclosure';

const MergeButtonContainer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card className='flex flex-col w-full text-black'>
      <div className='flex w-full justify-center'>
        <button
          className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          onClick={onOpen}>
          Merge
        </button>
      </div>
      <RegistryMergeModal isOpen={isOpen} onClose={onClose} />
    </Card>
  );
};

export default MergeButtonContainer;
