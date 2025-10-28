import { Handle, Position } from 'reactflow';
import { List, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ArrayNode({ data, selected }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(data.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative px-4 py-3 rounded-lg shadow-md transition-all ${
      selected
        ? 'ring-2 ring-green-500 shadow-lg'
        : 'ring-1 ring-green-200'
    } ${data.highlighted ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}
    style={{
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      minWidth: '180px'
    }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-green-400" />

      <div className="flex items-center gap-2 mb-1">
        <List className="w-4 h-4 text-white" />
        <span className="font-semibold text-white">{data.label}</span>
      </div>

      <div className="flex items-center justify-between gap-2 mt-2">
        <code className="text-xs text-green-100 truncate">{data.path}</code>
        <button
          onClick={handleCopyPath}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          title="Copy path"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-300" />
          ) : (
            <Copy className="w-3 h-3 text-white" />
          )}
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-400" />
    </div>
  );
}
