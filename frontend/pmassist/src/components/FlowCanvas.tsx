import { useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    ConnectionLineType,
} from '@xyflow/react';
import type {
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
    migrationNode: CustomNode,
};

interface Props {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
    onConnect?: OnConnect;
}

const FlowCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, onNodeClick, onConnect }: Props) => {
    const defaultEdgeOptions = useMemo(() => ({
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'var(--border-strong)', strokeWidth: 1.5 },
    }), []);

    return (
        // React Flow REQUIRES its direct parent to have explicit width AND height
        // Using position: absolute + inset: 0 guarantees this regardless of flex layout
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                fitViewOptions={{ padding: 0.3 }}
            >
                <Background color="var(--border-subtle)" gap={20} size={1} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
