import { Handle, Position } from 'reactflow';
import { Type, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function PrimitiveNode({ data, selected }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(data.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getColorByType = () => {
    switch (data.valueType) {
      case 'string':
        return {
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          ring: 'ring-orange-200'
        };
      case 'number':
        return {
          bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          ring: 'ring-blue-200'
        };
      case 'boolean':
        return {
          bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          ring: 'ring-purple-200'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          ring: 'ring-gray-200'
        };
    }
  };

  const colors = getColorByType();

  return (
    <div className={`relative px-4 py-3 rounded-lg shadow-md transition-all ${
      selected
        ? 'ring-2 ring-yellow-500 shadow-lg'
        : `ring-1 ${colors.ring}`
    } ${data.highlighted ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}
    style={{
      background: colors.bg,
      minWidth: '180px'
    }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-400" />

      <div className="flex items-center gap-2 mb-1">
        <Type className="w-4 h-4 text-white" />
        <span className="font-semibold text-white text-sm">{data.valueType}</span>
      </div>

      <div className="text-white font-mono text-sm mb-2 break-all">
        {data.label}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2">
        <code className="text-xs text-white/80 truncate">{data.path}</code>
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
    </div>
  );
}
