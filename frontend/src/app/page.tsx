'use client';

import { useState, useCallback, useEffect } from 'react';
import RequestBuilder from '@/components/RequestBuilder';
import ResponseViewer from '@/components/ResponseViewer';
import CollectionSidebar from '@/components/CollectionSidebar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'ok' | 'down'>('checking');
  const [lastHealthCheck, setLastHealthCheck] = useState<string | null>(null);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleSelectRequest = useCallback((request: any) => {
    setActiveRequest(request);
  }, []);

  const handleResponse = useCallback((responseData: any) => {
    setResponse(responseData);
  }, []);

  const handleSetLoading = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data?.status) {
          setHealthStatus('ok');
        } else {
          setHealthStatus('down');
        }
        setLastHealthCheck(new Date().toLocaleTimeString());
      } catch (error) {
        if (cancelled) return;
        setHealthStatus('down');
        setLastHealthCheck(new Date().toLocaleTimeString());
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <CollectionSidebar onSelectRequest={handleSelectRequest} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">API Testing Platform</h1>
              <p className="text-sm text-gray-400 mt-1">Build, test, and document your APIs</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  healthStatus === 'ok'
                    ? 'bg-green-900/30 text-green-400'
                    : healthStatus === 'checking'
                    ? 'bg-yellow-900/30 text-yellow-300'
                    : 'bg-red-900/30 text-red-400'
                }`}
              >
                {healthStatus === 'ok' && 'Connected'}
                {healthStatus === 'checking' && 'Checking...'}
                {healthStatus === 'down' && 'Backend offline'}
              </span>
              {lastHealthCheck && (
                <span className="text-xs text-gray-400">Last check {lastHealthCheck}</span>
              )}
            </div>
          </div>
        </header>

        {/* Request Builder */}
        <RequestBuilder 
          request={activeRequest}
          onResponse={handleResponse}
          isLoading={loading}
          setIsLoading={handleSetLoading}
        />

        {/* Response Viewer */}
        <ResponseViewer response={response} loading={loading} />
      </div>
    </div>
  );
}
