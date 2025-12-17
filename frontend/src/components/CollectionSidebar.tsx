'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Collection {
  _id: string;
  name: string;
  description: string;
  requests: any[];
  createdAt: string;
}

export default function CollectionSidebar({ onSelectRequest }: any) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${API_URL}/api/collections`);
      const data = await res.json();
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setCollections(data);
      } else {
        console.error('API returned non-array data:', data);
        setCollections([]);
        if (data.error) {
          toast.error(`Failed to fetch collections: ${data.error}`);
        } else {
          toast.error('Failed to fetch collections: Invalid response format');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch collections');
      console.error(error);
      setCollections([]); // Ensure collections remains an array
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName })
      });
      
      const data = await res.json();
      setCollections([...collections, data]);
      setNewCollectionName('');
      setIsCreating(false);
      toast.success('Collection created!');
    } catch (error) {
      toast.error('Failed to create collection');
      console.error(error);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      await fetch(`${API_URL}/api/collections/${id}`, {
        method: 'DELETE'
      });
      
      setCollections(collections.filter(c => c._id !== id));
      toast.success('Collection deleted');
    } catch (error) {
      toast.error('Failed to delete collection');
      console.error(error);
    }
  };

  const toggleCollection = (id: string) => {
    setExpandedCollections({
      ...expandedCollections,
      [id]: !expandedCollections[id]
    });
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-3">Collections</h2>
        
        {isCreating ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateCollection}
                className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCollectionName('');
                }}
                className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-sm transition"
          >
            + New Collection
          </button>
        )}
      </div>

      {/* Collections List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!Array.isArray(collections) || collections.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No collections yet</p>
            <p className="text-xs mt-1">Create one to get started</p>
          </div>
        ) : (
          collections.map((collection) => (
            <div key={collection._id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 hover:bg-gray-800 transition cursor-pointer">
                <div 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => toggleCollection(collection._id)}
                >
                  <span className="text-gray-400">
                    {expandedCollections[collection._id] ? '▼' : '▶'}
                  </span>
                  <span className="font-medium">{collection.name}</span>
                  <span className="text-xs text-gray-500">
                    ({collection.requests?.length || 0})
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(collection._id);
                  }}
                  className="p-1 hover:bg-red-900/30 rounded text-red-400 hover:text-red-300 transition"
                  title="Delete collection"
                >
                  🗑️
                </button>
              </div>
              
              {expandedCollections[collection._id] && (
                <div className="border-t border-gray-800 p-2 space-y-1">
                  {collection.requests?.length === 0 ? (
                    <p className="text-xs text-gray-500 p-2">No requests</p>
                  ) : (
                    collection.requests?.map((request) => (
                      <button
                        key={request._id}
                        onClick={() => onSelectRequest(request)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-sm transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            request.method === 'GET' ? 'bg-green-900/30 text-green-400' :
                            request.method === 'POST' ? 'bg-yellow-900/30 text-yellow-400' :
                            request.method === 'PUT' ? 'bg-blue-900/30 text-blue-400' :
                            request.method === 'DELETE' ? 'bg-red-900/30 text-red-400' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {request.method}
                          </span>
                          <span className="truncate">{request.name}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
