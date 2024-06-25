import React from 'react';
import Card from 'components/card/Card';
import AddConnectionModal from './AddConnectionModal';
import CustomConnectionDrawer from './CustomConnectionDrawer'; // Import the CustomConnectionDrawer component
import { useRegistryStore } from '../../zustand/registry/registryStore';
import useFetchConnections from 'hooks/registry/useFetchConnections';
import { FaTrash, FaPlug } from 'react-icons/fa';
import useRegistryConnections from 'hooks/registry/useRegistryConnections';
import useDisclosure from 'hooks/useDisclosure';

export default function Connections() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const [selectedConnection, setSelectedConnection] = React.useState(null);

  const connections = useRegistryStore((state) => state.connections);

  const { errorMessage, isLoading } = useFetchConnections();

  const {
    deleteConnection,
    isLoading: deletingConnectionLoading,
    deletingConnectionId,
  } = useRegistryConnections();

  const initiateDeleteConnection = (connectionId: string) => {
    deleteConnection(connectionId);
  };

  const handleConnectionClick = (connection: any) => {
    setSelectedConnection(connection);
    onDrawerOpen();
  };

  return (
    <>
      <Card className="flex flex-col w-[45%] overflow-x-auto px-0">
        <div className="px-6 mb-2 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-secondaryGray.900 text-2xl mb-1 font-bold">
              Connections
            </h2>
            <button className={`btn ${isLoading ? 'loading' : ''}`} onClick={onOpen}>
              Add
            </button>
          </div>
          <p className="text-gray-400 mt-4 text-md mb-10">
            A connection allows sync between two data sources.
          </p>
          {isLoading ? (
            <div className="flex justify-center mt-4 py-4">
              <div className="spinner"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              {connections.length === 0 ? (
                <p className="text-left">No connections available yet</p>
              ) : (
                connections.map((connection) => (
                  <li
                    key={connection.id}
                    className="bg-secondaryGray.300 cursor-pointer p-2 text-md rounded-md"
                    onClick={() => handleConnectionClick(connection)} // Open the drawer on click
                  >
                    <div className="flex items-center">
                      <span className="flex-1">
                        {connection.dataSources[0].split('/').pop()}
                        <FaPlug className="mx-2" /> {/* Connection icon */}
                        {connection.dataSources[1].split('/').pop()}
                      </span>
                      {deletingConnectionLoading && deletingConnectionId === connection.id ? (
                        <div className="spinner ml-auto"></div>
                      ) : (
                        <FaTrash
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent li onClick from being called
                            initiateDeleteConnection(connection.id);
                          }}
                          className="ml-auto w-4 h-4"
                        />
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </Card>
      <AddConnectionModal isOpen={isOpen} onClose={onClose} />
      {selectedConnection && (
        <CustomConnectionDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          connection={selectedConnection}
        />
      )}
    </>
  );
}
