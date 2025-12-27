import { render, screen } from '@testing-library/react';
import ResponseViewer from '../ResponseViewer';
import type { ApiResult } from '../../types';

describe('ResponseViewer', () => {
  it('shows loading spinner when loading', () => {
    render(<ResponseViewer response={null} loading={true} />);
    expect(screen.getByText(/Executing request/i)).toBeInTheDocument();
  });

  it('shows empty state when no response', () => {
    render(<ResponseViewer response={null} loading={false} />);
    expect(screen.getByText(/Ready to test/i)).toBeInTheDocument();
  });

  it('renders status and time when response provided', () => {
    const resp: ApiResult = {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: { hello: 'world' },
      time: 123
    };
    render(<ResponseViewer response={resp} loading={false} />);
    expect(screen.getByText(/200 OK/i)).toBeInTheDocument();
    expect(screen.getByText(/123ms/i)).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    const resp: ApiResult = { error: 'Something went wrong' } as any;
    render(<ResponseViewer response={resp} loading={false} />);
    expect(screen.getByText(/Request Failed/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
