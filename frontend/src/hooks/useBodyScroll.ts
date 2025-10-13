import { useEffect } from 'react';

export const useBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when mobile menu is open
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      // Restore scrolling when mobile menu is closed
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);
};
