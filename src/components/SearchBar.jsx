import { useState } from 'react';
import { Search, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function SearchBar({ nodes, onSearch }) {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState(null);

  const handleSearch = () => {
    if (!query.trim()) {
      setMessage({ type: 'error', text: 'Please enter a search query' });
      onSearch(null);
      return;
    }

    if (!nodes || nodes.length === 0) {
      setMessage({ type: 'error', text: 'No JSON data to search' });
      onSearch(null);
      return;
    }

    const foundNodeId = findNodeByPath(query);

    if (foundNodeId) {
      setMessage({ type: 'success', text: `Match found: ${query}` });
      onSearch(foundNodeId);
    } else {
      setMessage({ type: 'error', text: 'No match found' });
      onSearch(null);
    }
  };

  const findNodeByPath = (searchQuery) => {
    const normalizedQuery = searchQuery.trim();

    for (const node of nodes) {
      if (node.data.path === normalizedQuery) {
        return node.id;
      }

      const pathVariants = [
        node.data.path,
        node.data.path.replace(/\./g, ''),
        node.data.path.replace(/\$/g, '')
      ];

      const queryVariants = [
        normalizedQuery,
        normalizedQuery.startsWith('$.') ? normalizedQuery : `$.${normalizedQuery}`,
        normalizedQuery.replace(/\$/g, '')
      ];

      for (const pathVariant of pathVariants) {
        for (const queryVariant of queryVariants) {
          if (pathVariant === queryVariant) {
            return node.id;
          }
        }
      }
    }

    return null;
  };

  const handleClear = () => {
    setQuery('');
    setMessage(null);
    onSearch(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by JSON path (e.g., $.user.name or items[0].id)"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>

      {message && (
        <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span className={`text-sm ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </span>
        </div>
      )}
    </div>
  );
}
