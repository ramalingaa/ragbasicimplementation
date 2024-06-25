import React from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  List,
  ListItem,
  Menu,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import AddAssociationModal from './AddAssociationModal';
import CustomAssociationDrawer from './CustomAssociationDrawer'; // Import the CustomAssociationDrawer component
import { useRegistryStore } from '../../zustand/registry/registryStore';
import useFetchAssociations from 'hooks/registry/useFetchAssociations';
import useRegistryAssociations from 'hooks/registry/useRegistryAssociations';
import { FaTrash, FaLink } from 'react-icons/fa';

export default function Associations() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const [selectedAssociation, setSelectedAssociation] = React.useState(null);

  const associations = useRegistryStore((state) => state.associations);

  const { errorMessage, isLoading } = useFetchAssociations();
  const {
    deleteAssociation,
    isLoading: deletingAssociationLoading,
    deletingAssociationId,
  } = useRegistryAssociations();

  const initiateDeleteAssociation = (associationId: string) => {
    deleteAssociation(associationId);
  };

  const handleAssociationClick = (association: any) => {
    setSelectedAssociation(association);
    onDrawerOpen();
  };

  return (
    <>
      <Card
        className='flex flex-col w-[45%] px-0 overflow-x-scroll'
      >
        <Flex px="25px" mb="8px" flexDir="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Text
              color={textColor}
              fontSize="22px"
              mb="4px"
              fontWeight="700"
              lineHeight="100%"
            >
              Associations
            </Text>
            <Button isLoading={isLoading} colorScheme="gray" onClick={onOpen}>
              Add
            </Button>
          </Flex>
          <Text
            color={textColorSecondary}
            mt={4}
            fontSize="md"
            me="26px"
            mb="40px"
          >
            An association allows one data source to be referenced in another.
          </Text>
          {isLoading ? (
            <Center mt={4} py={4}>
              <Spinner size="xl" />
            </Center>
          ) : (
            <List spacing={2}>
              {associations.length === 0 ? (
                <Text textAlign={'left'}>No associations available yet</Text>
              ) : (
                associations.map((association) => (
                  <ListItem
                    key={association.id}
                    bg={'secondaryGray.300'}
                    cursor="pointer"
                    p={2}
                    fontSize="md"
                    borderRadius="md"
                    onClick={() => handleAssociationClick(association)} // Open the drawer on click
                  >
                    <Flex direction="row" alignItems="center">
                      <Text flex="1">
                        {association.dataSources[0].split('/').pop()}
                        <Icon as={FaLink} mx={2} /> {/* Association icon */}
                        {association.dataSources[1].split('/').pop()}
                      </Text>
                      {deletingAssociationLoading &&
                      deletingAssociationId === association.id ? (
                        <Spinner size="sm" ml="auto" />
                      ) : (
                        <Icon
                          as={FaTrash}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent ListItem onClick from being called
                            initiateDeleteAssociation(association.id);
                          }}
                          boxSize="0.8em"
                          ml="auto"
                        />
                      )}
                    </Flex>
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Flex>
      </Card>
      <AddAssociationModal isOpen={isOpen} onClose={onClose} />
      {selectedAssociation && (
        <CustomAssociationDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          association={selectedAssociation}
        />
      )}
    </>
  );
}
