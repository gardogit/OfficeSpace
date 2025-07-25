import { useEffect, useRef, useCallback } from 'react';
import { 
  trapFocus, 
  handleArrowNavigation, 
  getFocusableElements, 
  FocusManager,
  announceToScreenReader,
  KEYS
} from '../utils/accessibility';

/**
 * Hook for managing focus trap in modals and dropdowns
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const focusManager = useRef(new FocusManager());

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Save current focus
    focusManager.current.saveFocus();

    // Focus first focusable element
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE) {
        // Let parent handle escape
        return;
      }

      if (containerRef.current) {
        trapFocus(containerRef.current, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus when component unmounts or becomes inactive
      focusManager.current.restoreFocus();
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for keyboard navigation in lists and grids
 */
export const useKeyboardNavigation = (
  items: any[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'grid';
    columnsCount?: number;
    wrap?: boolean;
    onActivate?: (index: number) => void;
  } = {}
) => {
  const { orientation = 'vertical', columnsCount = 1, wrap = true, onActivate } = options;
  const containerRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    // Handle activation keys
    if (event.key === KEYS.ENTER || event.key === KEYS.SPACE) {
      event.preventDefault();
      onActivate?.(currentIndexRef.current);
      return;
    }

    // Handle arrow navigation
    const newIndex = handleArrowNavigation(
      event,
      focusableElements,
      currentIndexRef.current,
      { orientation, columnsCount, wrap }
    );

    currentIndexRef.current = newIndex;
  }, [orientation, columnsCount, wrap, onActivate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const focusItem = useCallback((index: number) => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const targetIndex = Math.max(0, Math.min(focusableElements.length - 1, index));
    
    if (focusableElements[targetIndex]) {
      focusableElements[targetIndex].focus();
      currentIndexRef.current = targetIndex;
    }
  }, []);

  return {
    containerRef,
    focusItem,
    currentIndex: currentIndexRef.current
  };
};

/**
 * Hook for managing ARIA live regions
 */
export const useAnnouncements = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  return { announce };
};

/**
 * Hook for managing roving tabindex
 */
export const useRovingTabIndex = (items: any[], activeIndex: number = 0) => {
  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  const getAriaSelected = useCallback((index: number) => {
    return index === activeIndex;
  }, [activeIndex]);

  return {
    getTabIndex,
    getAriaSelected
  };
};

/**
 * Hook for managing skip links
 */
export const useSkipLinks = () => {
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent instanceof HTMLElement) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const skipToNavigation = useCallback(() => {
    const navigation = document.querySelector('nav, [role="navigation"]');
    if (navigation instanceof HTMLElement) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return {
    skipToContent,
    skipToNavigation
  };
};