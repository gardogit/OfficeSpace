import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GridContainer } from '../../../components/layout/GridContainer';

describe('GridContainer', () => {
  it('renders children correctly', () => {
    render(
      <GridContainer>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </GridContainer>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('applies default grid classes', () => {
    const { container } = render(
      <GridContainer>
        <div>Child</div>
      </GridContainer>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6');
  });

  it('applies custom column configuration', () => {
    const { container } = render(
      <GridContainer columns={{ sm: 2, md: 3, lg: 4, xl: 6 }}>
        <div>Child</div>
      </GridContainer>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'xl:grid-cols-6');
  });

  it('applies partial column configuration', () => {
    const { container } = render(
      <GridContainer columns={{ sm: 1, lg: 2 }}>
        <div>Child</div>
      </GridContainer>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
    expect(gridElement).not.toHaveClass('md:grid-cols-2', 'xl:grid-cols-2');
  });

  it('applies different gap sizes', () => {
    const { container: smallGap } = render(
      <GridContainer gap="sm">
        <div>Child</div>
      </GridContainer>
    );

    const { container: largeGap } = render(
      <GridContainer gap="lg">
        <div>Child</div>
      </GridContainer>
    );

    expect(smallGap.firstChild).toHaveClass('gap-4');
    expect(largeGap.firstChild).toHaveClass('gap-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <GridContainer className="custom-class">
        <div>Child</div>
      </GridContainer>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('custom-class');
  });

  it('combines all props correctly', () => {
    const { container } = render(
      <GridContainer 
        columns={{ sm: 1, md: 2 }}
        gap="xl"
        className="test-class"
      >
        <div>Child</div>
      </GridContainer>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'gap-10',
      'test-class'
    );
  });
});