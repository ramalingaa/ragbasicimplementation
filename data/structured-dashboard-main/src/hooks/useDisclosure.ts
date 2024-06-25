import { useState, useCallback } from 'react';

function useDisclosure(defaultIsOpen = false) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prevState) => !prevState), []);

  return { isOpen, onOpen, onClose, onToggle };
}

export default useDisclosure;
