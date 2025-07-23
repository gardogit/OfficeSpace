import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  it('renders initials when no image is provided', () => {
    render(<Avatar name="John Doe" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar name="John Doe" src="/test-avatar.jpg" />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-avatar.jpg');
    expect(image).toHaveAttribute('alt', 'Avatar de John Doe');
  });

  it('falls back to initials when image fails to load', () => {
    render(<Avatar name="John Doe" src="/invalid-image.jpg" />);
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('generates correct initials for single name', () => {
    render(<Avatar name="John" />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('generates correct initials for multiple names', () => {
    render(<Avatar name="John Michael Doe" />);
    
    expect(screen.getByText('JM')).toBeInTheDocument();
  });

  it('handles empty name gracefully', () => {
    render(<Avatar name="" />);
    
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('applies small size classes', () => {
    const { container } = render(<Avatar name="John Doe" size="sm" />);
    
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('w-8', 'h-8', 'text-sm');
  });

  it('applies medium size classes (default)', () => {
    const { container } = render(<Avatar name="John Doe" />);
    
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('w-12', 'h-12', 'text-base');
  });

  it('applies large size classes', () => {
    const { container } = render(<Avatar name="John Doe" size="lg" />);
    
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('w-16', 'h-16', 'text-lg');
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar name="John Doe" className="custom-class" />);
    
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('custom-class');
  });

  it('applies base classes to all avatars', () => {
    const { container } = render(<Avatar name="John Doe" />);
    
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'bg-gray-500',
      'text-white',
      'font-medium'
    );
  });

  it('sets title attribute with name', () => {
    const { container } = render(<Avatar name="John Doe" />);
    
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveAttribute('title', 'John Doe');
  });

  it('applies object-cover class to images', () => {
    render(<Avatar name="John Doe" src="/test-avatar.jpg" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-cover');
  });

  it('converts initials to uppercase', () => {
    render(<Avatar name="john doe" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('limits initials to 2 characters', () => {
    render(<Avatar name="John Michael David Doe" />);
    
    expect(screen.getByText('JM')).toBeInTheDocument();
  });
});