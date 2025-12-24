'use client';

import { useState, useCallback } from 'react';
import RequestBuilder from '@/components/RequestBuilder';
import ResponseViewer from '@/components/ResponseViewer';
import CollectionSidebar from '@/components/CollectionSidebar';

export default function Home() {
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-semibold">
                Connected
              </span>
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
