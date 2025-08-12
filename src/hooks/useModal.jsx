/**
 * useModal Hook
 * Hook for managing modal state and operations
 */

import { useCallback, useState } from 'react';

export default function useModal() {
  const [modalContent, setModalContent] = useState(null);

  const showModal = useCallback((title, content, closeOnClickOutside = true) => {
    setModalContent({
      title,
      content,
      closeOnClickOutside,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);

  return [modalContent, showModal, closeModal];
}
