/**
 * Accessibility utilities for the corporate intranet dashboard
 * Provides functions for keyboard navigation, ARIA management, and focus handling
 */

export interface FocusableElement extends HTMLElement {
  focus(): void;
  blur(): void;
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): FocusableElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as FocusableElement[];
};

/**
 * Trap focus within a container (useful for modals and dropdowns)
 */
export const trapFocus = (container: HTMLElement, event: KeyboardEvent): void => {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
};

/**
 * Handle keyboard navigation for lists and grids
 */
export const handleArrowNavigation = (
  event: KeyboardEvent,
  elements: FocusableElement[],
  currentIndex: number,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'grid';
    columnsCount?: number;
    wrap?: boolean;
  } = {}
): number => {
  const { orientation = 'vertical', columnsCount = 1, wrap = true } = options;
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowUp':
      if (orientation === 'vertical' || orientation === 'grid') {
        event.preventDefault();
        newIndex = orientation === 'grid' 
          ? Math.max(0, currentIndex - columnsCount)
          : currentIndex - 1;
        
        if (newIndex < 0 && wrap) {
          newIndex = elements.length - 1;
        }
      }
      break;

    case 'ArrowDown':
      if (orientation === 'vertical' || orientation === 'grid') {
        event.preventDefault();
        newIndex = orientation === 'grid'
          ? Math.min(elements.length - 1, currentIndex + columnsCount)
          : currentIndex + 1;
        
        if (newIndex >= elements.length && wrap) {
          newIndex = 0;
        }
      }
      break;

    case 'ArrowLeft':
      if (orientation === 'horizontal' || orientation === 'grid') {
        event.preventDefault();
        newIndex = currentIndex - 1;
        
        if (newIndex < 0 && wrap) {
          newIndex = elements.length - 1;
        }
      }
      break;

    case 'ArrowRight':
      if (orientation === 'horizontal' || orientation === 'grid') {
        event.preventDefault();
        newIndex = currentIndex + 1;
        
        if (newIndex >= elements.length && wrap) {
          newIndex = 0;
        }
      }
      break;

    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;

    case 'End':
      event.preventDefault();
      newIndex = elements.length - 1;
      break;
  }

  // Ensure index is within bounds
  newIndex = Math.max(0, Math.min(elements.length - 1, newIndex));

  if (newIndex !== currentIndex && elements[newIndex]) {
    elements[newIndex].focus();
  }

  return newIndex;
};

/**
 * Announce dynamic content changes to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Generate unique IDs for ARIA relationships
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if an element is visible and focusable
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
};

/**
 * Manage focus restoration after modal/dropdown closes
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null;

  saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }

  restoreFocus(): void {
    if (this.previousFocus && isElementVisible(this.previousFocus)) {
      this.previousFocus.focus();
    }
  }

  clear(): void {
    this.previousFocus = null;
  }
}

/**
 * Keyboard event constants
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End'
} as const;

/**
 * ARIA role constants
 */
export const ARIA_ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TABLIST: 'tablist',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  DIALOG: 'dialog',
  ALERT: 'alert',
  STATUS: 'status',
  REGION: 'region',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo'
} as const;