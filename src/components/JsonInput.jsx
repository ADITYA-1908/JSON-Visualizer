import { useState } from 'react';
import { FileJson, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = {
  user: {
    id: 1,
    name: "John Doe",
    address: {
      city: "New York",
      country: "USA"
    },
    items: [
      {
        name: "item1"
      },
      {
        name: "item2"
      }
    ]
  }
};



export default function JsonInput({ onVisualize }) {
  const [input, setInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [error, setError] = useState('');

  const handleVisualize = () => {
    setError('');

    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      onVisualize(parsed);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleClear = () => {
    setInput('');
    setError('');
    onVisualize(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <FileJson className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">JSON Input</h2>
        </div>
        <p className="text-sm text-gray-600">Paste your JSON data below</p>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 w-full p-3 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Enter or paste JSON here..."
          spellCheck={false}
        />

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleVisualize}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Visualize
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
