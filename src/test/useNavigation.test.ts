import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNavigation } from '../hooks/useNavigation';

// Mock console.log to avoid noise in tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('useNavigation', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  it('returns default sections', () => {
    const { result } = renderHook(() => useNavigation());
    
    expect(result.current.sections).toEqual([
      { id: 'inicio', label: 'Inicio' },
      { id: 'noticias', label: 'Noticias' },
      { id: 'eventos', label: 'Eventos' },
      { id: 'equipo', label: 'Equipo' },
      { id: 'recursos', label: 'Recursos' },
      { id: 'espacios', label: 'Espacios' }
    ]);
  });

  it('sets first section as active by default', () => {
    const { result } = renderHook(() => useNavigation());
    
    expect(result.current.activeSection).toBe('inicio');
  });

  it('accepts initial section parameter', () => {
    const { result } = renderHook(() => useNavigation('noticias'));
    
    expect(result.current.activeSection).toBe('noticias');
  });

  it('changes active section when handleSectionChange is called', () => {
    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.handleSectionChange('eventos');
    });
    
    expect(result.current.activeSection).toBe('eventos');
  });

  it('logs navigation changes', () => {
    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.handleSectionChange('equipo');
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Navegando a sección: equipo');
  });

  it('maintains stable function reference for handleSectionChange', () => {
    const { result, rerender } = renderHook(() => useNavigation());
    
    const firstHandler = result.current.handleSectionChange;
    
    rerender();
    
    const secondHandler = result.current.handleSectionChange;
    
    expect(firstHandler).toBe(secondHandler);
  });

  it('handles multiple section changes correctly', () => {
    const { result } = renderHook(() => useNavigation());
    
    act(() => {
      result.current.handleSectionChange('noticias');
    });
    expect(result.current.activeSection).toBe('noticias');
    
    act(() => {
      result.current.handleSectionChange('recursos');
    });
    expect(result.current.activeSection).toBe('recursos');
    
    act(() => {
      result.current.handleSectionChange('inicio');
    });
    expect(result.current.activeSection).toBe('inicio');
  });

  it('returns consistent sections array reference', () => {
    const { result, rerender } = renderHook(() => useNavigation());
    
    const firstSections = result.current.sections;
    
    rerender();
    
    const secondSections = result.current.sections;
    
    expect(firstSections).toBe(secondSections);
  });
});