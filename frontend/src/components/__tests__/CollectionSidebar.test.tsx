import { render, screen, fireEvent } from '@testing-library/react';
import CollectionSidebar from '../CollectionSidebar';

// Mock global fetch
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('CollectionSidebar', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // mock localStorage
    const store: Record<string, string> = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => store[key] || null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => { store[key] = value; });
  });

  it('shows empty state when no collections', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [] });

    render(<CollectionSidebar onSelectRequest={() => {}} />);

    expect(await screen.findByText(/No collections yet/i)).toBeInTheDocument();
  });

  it('renders collections and toggles expand', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [
        { _id: '1', name: 'Col A', description: '', requests: [], createdAt: '' },
        { _id: '2', name: 'Col B', description: '', requests: [], createdAt: '' },
      ]
    });

    render(<CollectionSidebar onSelectRequest={() => {}} />);

    expect(await screen.findByText('Col A')).toBeInTheDocument();
    expect(screen.getByText('Col B')).toBeInTheDocument();

    // Toggle expand first collection
    fireEvent.click(screen.getAllByText(/▶|▼/)[0]);
    // No requests rendered; but expansion toggled without errors
    expect(screen.getByText(/No requests/i)).toBeInTheDocument();
  });
});
