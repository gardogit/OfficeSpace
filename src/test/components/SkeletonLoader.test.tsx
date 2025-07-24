import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  CardSkeleton,
  NewsCarouselSkeleton,
  EventsListSkeleton,
  EmployeeGridSkeleton,
  QuickLinksSkeleton,
  SpacesListSkeleton,
  LaunchPadSkeleton,
  HeaderSkeleton
} from '../../components/common/SkeletonLoader';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'rounded');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveClass('custom-class');
  });

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width="100px" height="50px" />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('CardSkeleton', () => {
  it('renders without image by default', () => {
    const { container } = render(<CardSkeleton />);
    
    expect(container.querySelector('.h-48')).not.toBeInTheDocument();
  });

  it('renders with image when showImage is true', () => {
    const { container } = render(<CardSkeleton showImage={true} />);
    
    expect(container.querySelector('.h-48')).toBeInTheDocument();
  });

  it('has proper card structure', () => {
    const { container } = render(<CardSkeleton />);
    
    expect(container.querySelector('.bg-white.rounded-lg.border')).toBeInTheDocument();
  });
});

describe('NewsCarouselSkeleton', () => {
  it('renders carousel structure with image placeholder', () => {
    const { container } = render(<NewsCarouselSkeleton />);
    
    // Check for image placeholder
    expect(container.querySelector('.h-64')).toBeInTheDocument();
    
    // Check for content placeholders
    expect(container.querySelector('.h-8')).toBeInTheDocument();
    expect(container.querySelector('.h-4')).toBeInTheDocument();
  });

  it('renders navigation dots', () => {
    const { container } = render(<NewsCarouselSkeleton />);
    
    const dots = container.querySelectorAll('.w-2.h-2.rounded-full');
    expect(dots).toHaveLength(3);
  });
});

describe('EventsListSkeleton', () => {
  it('renders multiple event placeholders', () => {
    const { container } = render(<EventsListSkeleton />);
    
    const eventItems = container.querySelectorAll('.w-12.h-12.rounded');
    expect(eventItems).toHaveLength(4);
  });

  it('has proper card structure', () => {
    const { container } = render(<EventsListSkeleton />);
    
    expect(container.querySelector('.bg-white.rounded-lg.border')).toBeInTheDocument();
  });
});

describe('EmployeeGridSkeleton', () => {
  it('renders grid of employee placeholders', () => {
    const { container } = render(<EmployeeGridSkeleton />);
    
    const avatarPlaceholders = container.querySelectorAll('.w-16.h-16.rounded-full');
    expect(avatarPlaceholders).toHaveLength(6);
  });

  it('has proper grid structure', () => {
    const { container } = render(<EmployeeGridSkeleton />);
    
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});

describe('QuickLinksSkeleton', () => {
  it('renders quick links structure', () => {
    const { container } = render(<QuickLinksSkeleton />);
    
    const linkItems = container.querySelectorAll('.w-4.h-4');
    expect(linkItems).toHaveLength(5);
  });

  it('has proper card structure', () => {
    const { container } = render(<QuickLinksSkeleton />);
    
    expect(container.querySelector('.bg-white.rounded-lg.border')).toBeInTheDocument();
  });
});

describe('SpacesListSkeleton', () => {
  it('renders spaces list structure', () => {
    const { container } = render(<SpacesListSkeleton />);
    
    const spaceItems = container.querySelectorAll('.border.border-gray-100.rounded');
    expect(spaceItems).toHaveLength(4);
  });

  it('has proper card structure', () => {
    const { container } = render(<SpacesListSkeleton />);
    
    expect(container.querySelector('.bg-white.rounded-lg.border')).toBeInTheDocument();
  });
});

describe('LaunchPadSkeleton', () => {
  it('renders 3x3 grid of app placeholders', () => {
    const { container } = render(<LaunchPadSkeleton />);
    
    const appItems = container.querySelectorAll('.w-8.h-8.rounded');
    expect(appItems).toHaveLength(9);
  });

  it('has proper grid structure', () => {
    const { container } = render(<LaunchPadSkeleton />);
    
    expect(container.querySelector('.grid.grid-cols-3')).toBeInTheDocument();
  });
});

describe('HeaderSkeleton', () => {
  it('renders header structure with logo, search, and user controls', () => {
    const { container } = render(<HeaderSkeleton />);
    
    // Check for logo placeholder
    expect(container.querySelector('.h-8.w-32')).toBeInTheDocument();
    
    // Check for search bar placeholder
    expect(container.querySelector('.h-10.w-64')).toBeInTheDocument();
    
    // Check for user avatar placeholder
    expect(container.querySelector('.w-8.h-8.rounded-full')).toBeInTheDocument();
  });

  it('has proper header styling', () => {
    const { container } = render(<HeaderSkeleton />);
    
    expect(container.querySelector('.bg-white.border-b')).toBeInTheDocument();
  });
});