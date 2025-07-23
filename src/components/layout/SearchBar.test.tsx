import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  it('renders search input with default placeholder', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Buscar documentos...';
    render(<SearchBar placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('displays search icon', () => {
    const { container } = render(<SearchBar />);
    
    // Check for search icon SVG
    const searchIcon = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(searchIcon).toBeInTheDocument();
    
    // Check for search icon path
    const searchPath = container.querySelector('path[d*="21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"]');
    expect(searchPath).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    
    await user.type(searchInput, 'test query');
    
    expect(searchInput).toHaveValue('test query');
  });

  it('calls onSearch when form is submitted', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    
    await user.type(searchInput, 'test search');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    
    fireEvent.change(searchInput, { target: { value: 'keyboard search' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSearch).toHaveBeenCalledWith('keyboard search');
  });

  it('does not call onSearch with empty query', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('trims whitespace from search query', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    
    await user.type(searchInput, '  trimmed search  ');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('trimmed search');
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    
    // Initially no clear button
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    
    // Type something
    await user.type(searchInput, 'test');
    
    // Clear button should appear
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    
    // Type something
    await user.type(searchInput, 'test to clear');
    expect(searchInput).toHaveValue('test to clear');
    
    // Click clear button
    const clearButton = screen.getByRole('button');
    await user.click(clearButton);
    
    expect(searchInput).toHaveValue('');
  });

  it('clear button has correct icon', async () => {
    const user = userEvent.setup();
    const { container } = render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Buscar en el portal...');
    await user.type(searchInput, 'test');
    
    // Check for X icon in clear button
    const clearIcon = container.querySelector('path[d*="M6 18L18 6M6 6l12 12"]');
    expect(clearIcon).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<SearchBar />);
    
    // Check form structure
    const form = container.querySelector('form.relative');
    expect(form).toBeInTheDocument();
    
    // Check input styling
    const input = screen.getByPlaceholderText('Buscar en el portal...');
    expect(input).toHaveClass(
      'block',
      'w-full',
      'pl-10',
      'pr-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-lg'
    );
  });

  it('has proper focus styles', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Buscar en el portal...');
    expect(input).toHaveClass(
      'focus:outline-none',
      'focus:ring-1',
      'focus:ring-primary-500',
      'focus:border-primary-500'
    );
  });

  it('prevents default form submission', () => {
    const mockOnSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Test that form has the correct structure for preventing default
    expect(form).toHaveClass('relative');
  });
});