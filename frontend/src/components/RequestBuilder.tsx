'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
const authTypes = ['none', 'basic', 'bearer', 'api-key'];

interface RequestBuilderProps {
  request: any;
  onResponse: (response: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

function RequestBuilder({ request, onResponse, isLoading, setIsLoading }: RequestBuilderProps) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [auth, setAuth] = useState<any>({ type: 'none' });
  const [headerInput, setHeaderInput] = useState('');
  const [activeTab, setActiveTab] = useState('headers');
  const [requestName, setRequestName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [collections, setCollections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (request) {
      setMethod(request.method || 'GET');
      setUrl(request.url || '');
      // Headers from backend are already plain objects (Mongoose Map serialized to JSON)
      setHeaders(request.headers instanceof Map ? Object.fromEntries(request.headers) : (request.headers || {}));
      setBody(request.body || '');
      setAuth(request.auth || { type: 'none' });
    }
  }, [request]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/collections`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCollections(data);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      setCollections([]);
    }
  }, []);

  const handleSendRequest = useCallback(async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url,
          headers,
          body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
          auth
        })
      });

      const data = await response.json();
      onResponse(data);
      
      if (data.error) {
        toast.error('Request failed');
      } else {
        toast.success(`Request completed in ${data.time}ms`);
      }
    } catch (error: any) {
      toast.error('Request failed: ' + error.message);
      onResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [method, url, headers, body, auth, onResponse, setIsLoading]);

  const handleSaveRequest = useCallback(async () => {
    if (!requestName.trim()) {
      toast.error('Please enter a request name');
      return;
    }

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: requestName.trim(),
          method,
          url,
          headers,
          body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
          auth,
          collectionId: selectedCollectionId || undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save request');
      }

      const data = await response.json();
      toast.success('Request saved successfully!');
      setRequestName('');
      setSelectedCollectionId('');
    } catch (error: any) {
      toast.error('Failed to save request: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }, [requestName, url, method, headers, body, auth, selectedCollectionId]);

  const addHeader = useCallback(() => {
    const [key, value] = headerInput.split(':').map(s => s.trim());
    if (key && value) {
      setHeaders({ ...headers, [key]: value });
      setHeaderInput('');
    } else {
      toast.error('Invalid header format. Use Key: Value');
    }
  }, [headerInput, headers]);

  const removeHeader = useCallback((key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    setHeaders(newHeaders);
  }, [headers]);

  return (
    <div className="border-b border-gray-700 bg-gray-900">
      {/* Request Line */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-3">
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-4 py-2.5 bg-gray-900 border border-gray-600 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {methods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL"
            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendRequest()}
          />
          
          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {['headers', 'body', 'auth', 'save'].map(tab => (
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

      {/* Tab Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'headers' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={headerInput}
                onChange={(e) => setHeaderInput(e.target.value)}
                placeholder="Content-Type: application/json"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addHeader()}
              />
              <button
                onClick={addHeader}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded font-medium text-sm transition"
              >
                Add Header
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(headers).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No headers added</p>
              ) : (
                Object.entries(headers).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                    <div className="flex-1">
                      <span className="text-blue-400 font-medium">{key}:</span>{' '}
                      <span className="text-gray-300">{value}</span>
                    </div>
                    <button
                      onClick={() => removeHeader(key)}
                      className="ml-3 px-2 py-1 text-red-400 hover:bg-red-900/30 rounded transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div>
            {['POST', 'PUT', 'PATCH'].includes(method) ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-48 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Request body is not available for {method} requests</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Auth Type</label>
              <select 
                value={auth.type}
                onChange={(e) => setAuth({ type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {authTypes.map(a => (
                  <option key={a} value={a}>{a.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            {auth.type === 'bearer' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Token</label>
                <input
                  type="text"
                  value={auth.token || ''}
                  onChange={(e) => setAuth({ ...auth, token: e.target.value })}
                  placeholder="Enter bearer token"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {auth.type === 'basic' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
                  <input
                    type="text"
                    value={auth.username || ''}
                    onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                    placeholder="Username"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                  <input
                    type="password"
                    value={auth.password || ''}
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    placeholder="Password"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {auth.type === 'api-key' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">API Key</label>
                <input
                  type="text"
                  value={auth.apiKey || ''}
                  onChange={(e) => setAuth({ ...auth, apiKey: e.target.value })}
                  placeholder="Enter API key"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {auth.type === 'none' && (
              <div className="text-center py-8 text-gray-500">
                <p>No authentication required</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'save' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Request Name *</label>
              <input
                type="text"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="e.g., Get All Users"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Collection (Optional)</label>
              {collections.length > 0 ? (
                <select 
                  value={selectedCollectionId}
                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">-- None (Save as standalone) --</option>
                  {collections.map(col => (
                    <option key={col._id} value={col._id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-400 text-sm">
                  No collections available. Create one in the sidebar first.
                </div>
              )}
            </div>

            <button
              onClick={handleSaveRequest}
              disabled={isSaving || !requestName.trim()}
              className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSaving ? 'Saving...' : '💾 Save Request'}
            </button>

            <div className="bg-blue-900/30 border border-blue-700 rounded p-3 text-sm text-blue-100">
              <p className="font-medium">💡 Tip:</p>
              <p className="mt-1">Enter a request name and optionally select a collection to organize your API requests.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestBuilder;
