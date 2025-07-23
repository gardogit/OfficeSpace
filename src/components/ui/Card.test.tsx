import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('p-6', 'shadow-sm');
  });

  it('applies compact variant classes', () => {
    const { container } = render(
      <Card variant="compact">
        <p>Test content</p>
      </Card>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('p-4', 'shadow-sm');
  });

  it('applies highlighted variant classes', () => {
    const { container } = render(
      <Card variant="highlighted">
        <p>Test content</p>
      </Card>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('shadow-md', 'border-primary-200', 'bg-primary-50');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Test content</p>
      </Card>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('custom-class');
  });

  it('applies base classes to all variants', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass(
      'bg-white',
      'rounded-lg',
      'border',
      'border-gray-200',
      'transition-shadow',
      'duration-200'
    );
  });
});