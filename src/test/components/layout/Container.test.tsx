import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from '../../../components/layout/Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="child">Child Content</div>
      </Container>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass('mx-auto', 'max-w-7xl', 'px-4', 'sm:px-6', 'lg:px-8', 'py-4');
  });

  it('applies different size variants', () => {
    const { container: small } = render(
      <Container size="sm">
        <div>Content</div>
      </Container>
    );

    const { container: large } = render(
      <Container size="lg">
        <div>Content</div>
      </Container>
    );

    const { container: full } = render(
      <Container size="full">
        <div>Content</div>
      </Container>
    );

    expect(small.firstChild).toHaveClass('max-w-2xl');
    expect(large.firstChild).toHaveClass('max-w-6xl');
    expect(full.firstChild).toHaveClass('max-w-full');
  });

  it('applies different padding variants', () => {
    const { container: none } = render(
      <Container padding="none">
        <div>Content</div>
      </Container>
    );

    const { container: small } = render(
      <Container padding="sm">
        <div>Content</div>
      </Container>
    );

    const { container: large } = render(
      <Container padding="lg">
        <div>Content</div>
      </Container>
    );

    expect(none.firstChild).not.toHaveClass('px-4', 'py-4');
    expect(small.firstChild).toHaveClass('px-4', 'py-2');
    expect(large.firstChild).toHaveClass('px-6', 'sm:px-8', 'lg:px-12', 'py-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );

    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass('custom-class');
  });

  it('combines all props correctly', () => {
    const { container } = render(
      <Container 
        size="md"
        padding="lg"
        className="test-class"
      >
        <div>Content</div>
      </Container>
    );

    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass(
      'mx-auto',
      'max-w-4xl',
      'px-6',
      'sm:px-8',
      'lg:px-12',
      'py-6',
      'test-class'
    );
  });
});