import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import CollectionSidebar from './components/CollectionSidebar';
import type { RequestDocument, ApiResult } from './types';

function App() {
  const [activeRequest, setActiveRequest] = useState<RequestDocument | null>(null);
  const [response, setResponse] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleSelectRequest = useCallback((request: RequestDocument) => {
    setActiveRequest(request);
  }, []);

  const handleResponse = useCallback((responseData: ApiResult) => {
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

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
