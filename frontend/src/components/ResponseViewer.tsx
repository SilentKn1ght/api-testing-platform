'use client';

import { useState, useMemo } from 'react';

interface ResponseViewerProps {
  response: any;
  loading: boolean;
}

function ResponseViewer({ response, loading }: ResponseViewerProps) {
  const [activeTab, setActiveTab] = useState('body');

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

  // Memoize formatted JSON body
  const formattedBody = useMemo(() => {
    if (!response || !response.data) return null;
    if (typeof response.data === 'object') {
      return JSON.stringify(response.data, null, 2);
    }
    return response.data?.toString() || 'No response body';
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {['body', 'headers', 'raw'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize transition ${
              activeTab === tab 
                ? 'bg-gray-900 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'body' && (
          <div>
            <pre className="text-sm text-gray-300 font-mono bg-gray-800 p-4 rounded border border-gray-700 overflow-auto">
              {formattedBody}
            </pre>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-2">
            {Object.entries(response.headers || {}).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-start bg-gray-800 p-3 rounded border border-gray-700">
                <span className="text-blue-400 font-medium w-1/3">{key}:</span>
                <span className="text-gray-300 w-2/3 break-all">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'raw' && (
          <div>
            <pre className="text-sm text-gray-300 font-mono bg-gray-800 p-4 rounded border border-gray-700 overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseViewer;
