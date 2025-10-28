export function parseJsonToNodes(data, path = '$', parentId = null) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;

  function generateId() {
    return `node-${nodeId++}`;
  }

  function traverse(value, currentPath, parent) {
    const id = generateId();
    const node = {
      id,
      data: {
        path: currentPath,
        value,
        label: '',
        originalValue: value
      },
      position: { x: 0, y: 0 }
    };

    if (parent) {
      edges.push({
        id: `edge-${parent}-${id}`,
        source: parent,
        target: id,
        type: 'smoothstep',
        animated: false
      });
    }

    if (value === null) {
      node.type = 'primitiveNode';
      node.data.label = 'null';
      node.data.valueType = 'null';
      nodes.push(node);
      return id;
    }

    if (Array.isArray(value)) {
      node.type = 'arrayNode';
      node.data.label = `Array(${value.length})`;
      nodes.push(node);

      value.forEach((item, index) => {
        traverse(item, `${currentPath}[${index}]`, id);
      });

      return id;
    }

    if (typeof value === 'object') {
      node.type = 'objectNode';
      const keys = Object.keys(value);
      node.data.label = keys.length > 0 ? `{${keys.length} keys}` : '{}';
      nodes.push(node);

      keys.forEach((key) => {
        traverse(value[key], `${currentPath}.${key}`, id);
      });

      return id;
    }

    node.type = 'primitiveNode';
    node.data.valueType = typeof value;

    if (typeof value === 'string') {
      node.data.label = `"${value}"`;
    } else if (typeof value === 'boolean') {
      node.data.label = value.toString();
    } else if (typeof value === 'number') {
      node.data.label = value.toString();
    } else {
      node.data.label = String(value);
    }

    nodes.push(node);
    return id;
  }

  traverse(data, path, parentId);

  return { nodes, edges };
}

export function layoutNodes(nodes, edges) {
  const nodeMap = new Map(nodes.map(n => [n.id, { ...n, children: [] }]));

  edges.forEach(edge => {
    const parent = nodeMap.get(edge.source);
    if (parent) {
      parent.children.push(edge.target);
    }
  });

  let root = null;
  for (const node of nodeMap.values()) {
    const isRoot = !edges.some(e => e.target === node.id);
    if (isRoot) {
      root = node;
      break;
    }
  }

  if (!root) return nodes;

  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 100;

  function getSubtreeWidth(nodeId, memo = new Map()) {
    if (memo.has(nodeId)) return memo.get(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node || node.children.length === 0) {
      memo.set(nodeId, 1);
      return 1;
    }

    const width = node.children.reduce((sum, childId) => {
      return sum + getSubtreeWidth(childId, memo);
    }, 0);

    memo.set(nodeId, width);
    return width;
  }

  function positionNode(nodeId, x, y, leftBound) {
    const node = nodeMap.get(nodeId);
    if (!node) return;

    if (node.children.length === 0) {
      node.position = { x: leftBound * HORIZONTAL_SPACING, y };
      return leftBound + 1;
    }

    const childWidths = node.children.map(childId => getSubtreeWidth(childId));
    const totalWidth = childWidths.reduce((a, b) => a + b, 0);

    let currentLeft = leftBound;
    const childPositions = [];

    node.children.forEach((childId, index) => {
      const childWidth = childWidths[index];
      const nextLeft = positionNode(childId, x, y + VERTICAL_SPACING, currentLeft);
      childPositions.push((currentLeft + nextLeft - 1) / 2);
      currentLeft = nextLeft;
    });

    const avgChildX = childPositions.reduce((a, b) => a + b, 0) / childPositions.length;
    node.position = { x: avgChildX * HORIZONTAL_SPACING, y };

    return leftBound + totalWidth;
  }

  positionNode(root.id, 0, 0, 0);

  return Array.from(nodeMap.values()).map(({ children, ...node }) => node);
}

export function searchJsonPath(nodes, searchQuery) {
  if (!searchQuery.trim()) return null;

  const query = searchQuery.trim();

  for (const node of nodes) {
    if (node.data.path === query) {
      return node.id;
    }

    const normalizedPath = node.data.path.replace(/\[(\d+)\]/g, '[$1]');
    const normalizedQuery = query.replace(/\[(\d+)\]/g, '[$1]');

    if (normalizedPath === normalizedQuery) {
      return node.id;
    }
  }

  return null;
}
