import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import ObjectNode from './nodes/ObjectNode';
import ArrayNode from './nodes/ArrayNode';
import PrimitiveNode from './nodes/PrimitiveNode';

const nodeTypes = {
  objectNode: ObjectNode,
  arrayNode: ArrayNode,
  primitiveNode: PrimitiveNode
};

export default function TreeView({ nodes, edges, highlightedNodeId }) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, setCenter } = useReactFlow();

  useEffect(() => {
    if (nodes && edges) {
      setNodes(nodes);
      setEdges(edges);
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 50);
    }
  }, [nodes, edges, setNodes, setEdges, fitView]);

  useEffect(() => {
    if (highlightedNodeId && flowNodes.length > 0) {
      const updatedNodes = flowNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          highlighted: node.id === highlightedNodeId
        }
      }));
      setNodes(updatedNodes);

      const targetNode = flowNodes.find(n => n.id === highlightedNodeId);
      if (targetNode) {
        setCenter(targetNode.position.x, targetNode.position.y, {
          zoom: 1.2,
          duration: 800
        });
      }
    } else if (!highlightedNodeId && flowNodes.length > 0) {
      const updatedNodes = flowNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          highlighted: false
        }
      }));
      setNodes(updatedNodes);
    }
  }, [highlightedNodeId, flowNodes, setNodes, setCenter]);

  const onNodeClick = useCallback((event, node) => {
    console.log('Node clicked:', node.data);
  }, []);

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }}
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls className="bg-white border border-gray-300 rounded-lg shadow-md" />
        <MiniMap
          className="bg-white border border-gray-300 rounded-lg shadow-md"
          nodeColor={(node) => {
            switch (node.type) {
              case 'objectNode':
                return '#667eea';
              case 'arrayNode':
                return '#10b981';
              case 'primitiveNode':
                return '#f59e0b';
              default:
                return '#94a3b8';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
