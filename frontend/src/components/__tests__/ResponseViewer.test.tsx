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

  it('displays response size in status bar', () => {
    const resp: ApiResult = {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: { message: 'test data for size calculation' },
      time: 50
    };
    render(<ResponseViewer response={resp} loading={false} />);
    expect(screen.getByText(/Size:/i)).toBeInTheDocument();
  });

  it('truncates very large responses', () => {
    const largeData = 'x'.repeat(600000); // >500KB
    const resp: ApiResult = {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: largeData,
      time: 100
    };
    render(<ResponseViewer response={resp} loading={false} />);
    expect(screen.getByText(/Response truncated for performance/i)).toBeInTheDocument();
  });

  it('shows empty state for headers when none available', () => {
    const resp: ApiResult = {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: { test: 'data' },
      time: 50
    };
    const { getByText } = render(<ResponseViewer response={resp} loading={false} />);
    
    // Click headers tab
    const headersTab = getByText('headers');
    headersTab.click();
    
    expect(screen.getByText(/No headers available/i)).toBeInTheDocument();
  });
});
