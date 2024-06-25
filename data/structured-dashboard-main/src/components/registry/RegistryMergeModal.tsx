import React from 'react';
import { FaLink, FaPlug } from 'react-icons/fa';
import { useRegistryStore } from '../../zustand/registry/registryStore';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

interface RegistryMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistryMergeModal: React.FC<RegistryMergeModalProps> = ({
  isOpen,
  onClose,
}) => {
  
  const connections = useRegistryStore((state) => state.connections);
  const associations = useRegistryStore((state) => state.associations);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Merge" className="sm:w-full sm:max-w-3xl">
      <ul className="space-y-3 mb-4">
        {connections.length === 0 ? (
          <p className="text-left">No connections available yet</p>
        ) : (
          connections.map((connection) => (
            <li
              key={connection.id}
              className="bg-gray-300 cursor-pointer p-2 text-md rounded-md"
            >
              <div className="flex flex-row items-center">
                <span className="flex-1">
                  {connection.dataSources[0].split('/').pop()}
                  <FaPlug className="mx-2" />
                  {connection.dataSources[1].split('/').pop()}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
      <ul className="space-y-3">
        {associations.length === 0 ? (
          <p className="text-left">No associations available yet</p>
        ) : (
          associations.map((association) => (
            <li
              key={association.id}
              className="bg-gray-300 cursor-pointer p-2 text-md rounded-md"
            >
              <div className="flex flex-row items-center">
                <span className="flex-1">
                  {association.dataSources[0].split('/').pop()}
                  <FaLink className="mx-2" />
                  {association.dataSources[1].split('/').pop()}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
      <ModalButtons
        connectBtnText='Merge'
        onClose={onClose}
        handleConnect={onClose}
      />
    </ModalWrapper>
  );
};

export default RegistryMergeModal;