import { Network } from 'lucide-react';
import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';

import JsonInput from './components/JsonInput';
import SearchBar from './components/SearchBar';
import Toolbar from './components/Toolbar';
import TreeView from './components/TreeView';
import { layoutNodes, parseJsonToNodes } from './utils/jsonParser';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);

  const handleVisualize = (jsonData) => {
    if (!jsonData) {
      setTreeData(null);
      setHighlightedNodeId(null);
      return;
    }

    const { nodes, edges } = parseJsonToNodes(jsonData);
    const layoutedNodes = layoutNodes(nodes, edges);

    setTreeData({ nodes: layoutedNodes, edges });
    setHighlightedNodeId(null);
  };

  const handleSearch = (nodeId) => {
    setHighlightedNodeId(nodeId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="px-6 py-4 border-b bg-white border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                JSON Tree Visualizer
              </h1>
              <p className="text-sm text-gray-600">
                Convert JSON into interactive hierarchical diagrams
              </p>
            </div>
          </div>

          <Toolbar />
        </div>

        {treeData && (
          <div className="mt-4">
            <SearchBar
              nodes={treeData.nodes}
              onSearch={handleSearch}
            />
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 flex-shrink-0">
          <JsonInput onVisualize={handleVisualize} />
        </div>

        <div className="flex-1">
          {treeData ? (
            <ReactFlowProvider>
              <TreeView
                nodes={treeData.nodes}
                edges={treeData.edges}
                highlightedNodeId={highlightedNodeId}
              />
            </ReactFlowProvider>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                  <Network className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  No JSON to Visualize
                </h2>
                <p className="text-gray-600">
                  Enter JSON data on the left and click "Visualize" to see the tree
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
