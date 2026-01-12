'use client';

import { useState, useMemo, useCallback, memo } from 'react';

interface ResponseViewerProps {
  response: any;
  loading: boolean;
}

// Memoized tab button component
const TabButton = memo(({ 
  tab, 
  activeTab, 
  onClick 
}: { 
  tab: string; 
  activeTab: string; 
  onClick: (tab: string) => void 
}) => (
  <button
    onClick={() => onClick(tab)}
    className={`px-6 py-3 text-sm font-medium capitalize transition ${
      activeTab === tab 
        ? 'bg-gray-900 text-white border-b-2 border-blue-500' 
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
  >
    {tab}
  </button>
));
TabButton.displayName = 'TabButton';

// Memoized header row component for better list rendering
const HeaderRow = memo(({ keyName, value }: { keyName: string; value: any }) => (
  <div className="flex items-start bg-gray-800 p-3 rounded border border-gray-700">
    <span className="text-blue-400 font-medium w-1/3">{keyName}:</span>
    <span className="text-gray-300 w-2/3 break-all">{value}</span>
  </div>
));
HeaderRow.displayName = 'HeaderRow';

function ResponseViewer({ response, loading }: ResponseViewerProps) {
  const [activeTab, setActiveTab] = useState('body');

  // Memoize tab change handler to prevent re-renders
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Memoize status color calculation
  const getStatusColor = useMemo(() => {
    if (!response || !response.status) return 'text-gray-400 bg-gray-700';
    const status = response.status;
    if (status >= 200 && status < 300) return 'text-green-400 bg-green-900/30';
    if (status >= 300 && status < 400) return 'text-blue-400 bg-blue-900/30';
    if (status >= 400 && status < 500) return 'text-yellow-400 bg-yellow-900/30';
    if (status >= 500) return 'text-red-400 bg-red-900/30';
    return 'text-gray-400 bg-gray-700';
  }, [response?.status]);

  // Memoize formatted JSON body with truncation for large responses
  const formattedBody = useMemo(() => {
    if (!response || !response.data) return null;
    if (typeof response.data === 'object') {
      const jsonString = JSON.stringify(response.data, null, 2);
      // Truncate very large responses (>500KB) to prevent UI freezing
      if (jsonString.length > 500000) {
        return jsonString.substring(0, 500000) + '\n\n... [Response truncated for performance]';
      }
      return jsonString;
    }
    const dataStr = response.data?.toString() || 'No response body';
    // Truncate large text responses
    if (dataStr.length > 500000) {
      return dataStr.substring(0, 500000) + '\n\n... [Response truncated for performance]';
    }
    return dataStr;
  }, [response?.data]);

  // Memoize headers entries to prevent recalculation
  const headersEntries = useMemo(() => {
    if (!response?.headers) return [];
    return Object.entries(response.headers);
  }, [response?.headers]);

  // Memoize raw JSON string
  const rawJson = useMemo(() => {
    if (!response) return '';
    const jsonString = JSON.stringify(response, null, 2);
    // Truncate very large raw responses
    if (jsonString.length > 500000) {
      return jsonString.substring(0, 500000) + '\n\n... [Response truncated for performance]';
    }
    return jsonString;
  }, [response]);

  // Memoize raw JSON string
  const rawJson = useMemo(() => {
    if (!response) return '';
    const jsonString = JSON.stringify(response, null, 2);
    // Truncate very large raw responses
    if (jsonString.length > 500000) {
      return jsonString.substring(0, 500000) + '\n\n... [Response truncated for performance]';
    }
    return jsonString;
  }, [response]);

  // Calculate response size for display
  const responseSize = useMemo(() => {
    if (!response?.data) return null;
    const sizeInBytes = typeof response.data === 'string' 
      ? new Blob([response.data]).size 
      : new Blob([JSON.stringify(response.data)]).size;
    
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [response?.data]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Executing request...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📡</div>
          <p className="text-xl font-medium">Ready to test</p>
          <p className="text-sm mt-2">Send a request to see the response</p>
        </div>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex-1 bg-red-900/20 border-t border-red-700 overflow-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">❌</span>
            <h3 className="text-red-400 font-semibold text-xl">Request Failed</h3>
          </div>
          <pre className="text-red-200 text-sm bg-red-900/30 p-4 rounded border border-red-700 overflow-auto">
            {response.error}
          </pre>
          {response.details && (
            <div className="mt-4">
              <h4 className="text-red-400 font-medium mb-2">Details:</h4>
              <pre className="text-red-200 text-sm bg-red-900/30 p-4 rounded border border-red-700 overflow-auto">
                {typeof response.details === 'string' 
                  ? response.details 
                  : JSON.stringify(response.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Status:</span>
            <span className={`px-3 py-1 rounded font-semibold ${getStatusColor}`}>
              {response.status} {response.statusText}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Time:</span>
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded font-semibold">
              {response.time}ms
            </span>
          </div>
          {responseSize && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Size:</span>
              <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded font-semibold">
                {responseSize}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {['body', 'headers', 'raw'].map(tab => (
          <TabButton 
            key={tab} 
            tab={tab} 
            activeTab={activeTab} 
            onClick={handleTabChange} 
          />
        ))}
      </div>

      {/* Content - Only render active tab for performance */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'body' && (
          <div>
            <pre className="text-sm text-gray-300 font-mono bg-gray-800 p-4 rounded border border-gray-700 overflow-auto whitespace-pre-wrap break-words">
              {formattedBody}
            </pre>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-2">
            {headersEntries.map(([key, value]: [string, any]) => (
              <HeaderRow key={key} keyName={key} value={value} />
            ))}
            {headersEntries.length === 0 && (
              <p className="text-gray-500 text-center py-4">No headers available</p>
            )}
          </div>
        )}

        {activeTab === 'raw' && (
          <div>
            <pre className="text-sm text-gray-300 font-mono bg-gray-800 p-4 rounded border border-gray-700 overflow-auto whitespace-pre-wrap break-words">
              {rawJson}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseViewer;
