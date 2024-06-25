import React from 'react';
import { Box, Button, Flex, Text, Select, Icon } from '@chakra-ui/react';
import { FaLink } from 'react-icons/fa';

interface AssociationSelectedColumns {
  joining: { first: string | null; second: string | null };
}

interface Association {
  dataSources: string[];
  selectedColumns: AssociationSelectedColumns;
  id: string;
}

interface CustomAssociationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  association: Association | null;
}

const CustomAssociationDrawer: React.FC<CustomAssociationDrawerProps> = ({
  isOpen,
  onClose,
  association,
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
      <Box style={drawerStyle}>
        <Flex direction="column" p="4" h={'100%'}>
          <Text flex="1">
            {association?.dataSources[0].split('/').pop()}
            <Icon as={FaLink} mx={2} /> {/* Association icon */}
            {association?.dataSources[1].split('/').pop()}
          </Text>
          <Box mt={10}>
            <Text fontSize="lg" mb={2}>
              Selected Columns
            </Text>
            <Box mb={4}>
              <Text fontWeight="bold">Joining Columns:</Text>
              <Text>
                {association?.selectedColumns.joining.first},{' '}
                {association?.selectedColumns.joining.second}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Filters:</Text>
              <Select placeholder="Coming soon">
                <option value="coming_soon">Coming soon</option>
              </Select>
            </Box>
          </Box>
          <Button onClick={onClose} marginBottom="4">
            Close
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default CustomAssociationDrawer;
