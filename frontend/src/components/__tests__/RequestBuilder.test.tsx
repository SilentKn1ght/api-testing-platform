import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RequestBuilder from '../RequestBuilder';

// Mock global fetch for collections and execute
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('RequestBuilder', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('adds and removes headers', async () => {
    // collections fetch returns empty list
    mockFetch.mockResolvedValueOnce({ json: async () => [] });

    render(
      <RequestBuilder
        request={null}
        onResponse={() => {}}
        isLoading={false}
        setIsLoading={() => {}}
      />
    );

    const headerInput = screen.getByPlaceholderText(/Content-Type/i);
    fireEvent.change(headerInput, { target: { value: 'Content-Type: application/json' } });
    fireEvent.click(screen.getByText(/Add Header/i));

    expect(await screen.findByText(/Content-Type:/i)).toBeInTheDocument();
    expect(screen.getByText(/application\/json/i)).toBeInTheDocument();

    // remove header
    fireEvent.click(screen.getByText(/Remove/i));
    await waitFor(() => {
      expect(screen.queryByText(/Content-Type:/i)).not.toBeInTheDocument();
    });
  });

  it('disables send button when loading', async () => {
    // collections fetch returns empty list
    mockFetch.mockResolvedValueOnce({ json: async () => [] });

    render(
      <RequestBuilder
        request={null}
        onResponse={() => {}}
        isLoading={true}
        setIsLoading={() => {}}
      />
    );

    expect(screen.getByText(/Sending.../i)).toBeInTheDocument();
  });
});
