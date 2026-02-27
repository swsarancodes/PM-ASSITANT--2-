import { useState, useCallback } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import Header from './components/Header';
import FlowCanvas from './components/FlowCanvas';
import FlowDetailsPanel from './components/FlowDetailsPanel';
import EditToolbar from './components/EditToolbar';
import LandingPage from './components/LandingPage';
import type { ProjectMetadata, MigrationPhase } from './types';
import { AnimatePresence } from 'framer-motion';

type AppView = 'landing' | 'dashboard';

const DEFAULT_METADATA: ProjectMetadata = {
  title: "PM_ASSISTANT",
  scope: "PROJECT_ANALYSIS",
  status: "READY",
  lastUpdated: new Date().toISOString(),
};

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<MigrationPhase | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<ProjectMetadata>(DEFAULT_METADATA);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedPhase(node.data as unknown as MigrationPhase);
  }, []);

  const closePanel = useCallback(() => setSelectedPhase(null), []);

  const handleNodeUpdate = useCallback((updated: MigrationPhase) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === updated.id
          ? { ...n, data: { ...updated } }
          : n
      )
    );
    setSelectedPhase(updated);
  }, []);

  const handleAddNode = useCallback(() => {
    const newId = `PH-${String(nodes.length + 1).padStart(2, '0')}`;
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? (lastNode.position?.x || 0) + 350 : 100;
    const newY = lastNode ? (lastNode.position?.y || 150) : 150;

    const newNode: Node = {
      id: newId,
      type: 'migrationNode',
      position: { x: newX, y: newY },
      data: {
        id: newId,
        name: 'New Phase',
        status: 'pending',
        description: 'Click the edit icon to configure this phase.',
        business_logic: [],
        development_logic: [],
      },
    };

    const newEdges = [...edges];
    if (lastNode) {
      newEdges.push({
        id: `e-${lastNode.id}-${newId}`,
        source: lastNode.id,
        target: newId,
      });
    }

    setNodes((nds) => [...nds, newNode]);
    setEdges(newEdges);
  }, [nodes, edges]);

  const handleDeleteNode = useCallback(() => {
    if (!selectedPhase) return;
    const idToDelete = selectedPhase.id;
    setNodes((nds) => nds.filter((n) => n.id !== idToDelete));
    setEdges((eds) => eds.filter((e) => e.source !== idToDelete && e.target !== idToDelete));
    setSelectedPhase(null);
  }, [selectedPhase]);

  const handleSave = useCallback(() => {
    const exportData = {
      nodes: nodes.map((n) => ({ id: n.id, data: n.data, position: n.position })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    };
    console.log('Saved migration plan:', JSON.stringify(exportData, null, 2));
    alert('Migration plan saved to console.');
  }, [nodes, edges]);

  // =====================================================
  // UPLOAD HANDLER — Maps API response → React Flow
  // =====================================================
  const handleUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/analyze-project', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('[PM Assistant] API Response:', result);

      if (result.status === 'success' && result.data?.frontend_visualization) {
        const apiNodes = result.data.frontend_visualization.nodes || [];
        const apiEdges = result.data.frontend_visualization.edges || [];
        const functionalities = result.data.functionalities || [];

        // -----------------------------------------------
        // STEP 1: Build lookup — maps labels to flow data
        // -----------------------------------------------
        // API node labels can be: flow_name, component name, or anything
        // We index by ALL possible keys for maximum matching
        const flowLookup: Record<string, any> = {};

        for (const func of functionalities) {
          for (const flow of (func.flows || [])) {
            const flowInfo = {
              parentName: func.name,
              description: flow.description || func.description || '',
              business_logic: (flow.business_logic || []).map(
                (b: any) => `${b.rule}: ${b.description}`
              ),
              development_logic: (flow.development_logic || []).map(
                (d: any) => `${d.component}: ${d.description}`
              ),
            };

            // Index by flow_name
            flowLookup[flow.flow_name] = flowInfo;

            // Index by each development_logic component name
            for (const dev of (flow.development_logic || [])) {
              flowLookup[dev.component] = flowInfo;
            }

            // Index by parent functionality name (first flow wins)
            if (!flowLookup[func.name]) {
              flowLookup[func.name] = flowInfo;
            }
          }
        }

        console.log('[PM Assistant] Lookup keys:', Object.keys(flowLookup));

        // -----------------------------------------------
        // STEP 2: Map API nodes → React Flow nodes
        // -----------------------------------------------
        // API nodes already have: id, type, data.label, position
        // We just need to:
        //   a) Set type to our custom 'migrationNode'
        //   b) Spread positions wider (API gives 200px gaps, our cards are 240px)
        //   c) Enrich data with flow details from lookup
        const mappedNodes: Node[] = apiNodes.map((apiNode: any, i: number) => {
          const label: string = apiNode.data?.label || `Node ${apiNode.id}`;
          const matched = flowLookup[label] || null;

          // Scale positions wider
          const rawX = apiNode.position?.x ?? (i * 300);
          const rawY = apiNode.position?.y ?? 0;

          console.log(`[PM Assistant] Node [${apiNode.id}] "${label}" → match: ${matched ? 'YES' : 'NO'}`);

          return {
            id: String(apiNode.id),
            type: 'migrationNode',
            position: {
              x: rawX * 1.6 + 80,
              y: rawY === 0 ? 120 : rawY * 1.5 + 80,
            },
            data: {
              id: String(apiNode.id),
              name: label,
              status: apiNode.type === 'input' ? 'completed'
                : apiNode.type === 'output' ? 'pending'
                  : 'in-progress',
              type: apiNode.type || 'default',
              description: matched?.description || `Phase: ${label}`,
              business_logic: matched?.business_logic || [],
              development_logic: matched?.development_logic || [],
            },
          };
        });

        // -----------------------------------------------
        // STEP 3: Map API edges → React Flow edges
        // -----------------------------------------------
        // API edges already have: id, source, target, label
        // Just ensure IDs are strings and add animation
        const mappedEdges: Edge[] = apiEdges.map((apiEdge: any) => ({
          id: String(apiEdge.id),
          source: String(apiEdge.source),
          target: String(apiEdge.target),
          animated: true,
          label: apiEdge.label || undefined,
        }));

        console.log('[PM Assistant] Mapped nodes:', mappedNodes.length);
        console.log('[PM Assistant] Mapped edges:', mappedEdges.length);
        console.log('[PM Assistant] First node:', mappedNodes[0]);

        // -----------------------------------------------
        // STEP 4: Set state → triggers React Flow render
        // -----------------------------------------------
        setNodes(mappedNodes);
        setEdges(mappedEdges);
        setMetadata({
          title: 'PM_ASSISTANT',
          scope: `${mappedNodes.length}_PHASES_MAPPED`,
          status: 'ANALYSIS_COMPLETE',
          lastUpdated: new Date().toISOString(),
        });
        setView('dashboard');
      } else {
        console.error('[PM Assistant] Unexpected response:', result);
        alert('Unexpected API response format.');
      }
    } catch (error) {
      console.error('[PM Assistant] Upload error:', error);
      alert('Failed to analyze PPT. Ensure backend is running at http://localhost:8000');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    setView('landing');
    setSelectedPhase(null);
  }, []);

  // Landing page
  if (view === 'landing') {
    return <LandingPage onUpload={handleUpload} isAnalyzing={isAnalyzing} />;
  }

  // Dashboard view — CRITICAL: React Flow needs explicit height on its container
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Header metadata={metadata} onUpload={handleUpload} />
      <EditToolbar
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onSave={handleSave}
        onBack={handleBack}
        hasSelection={!!selectedPhase}
        nodeCount={nodes.length}
      />

      {/* Main area: flex-grow with explicit height for React Flow */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        minHeight: 0, /* Critical: allows flex child to shrink below content size */
      }}>
        {/* React Flow container — MUST have explicit width + height */}
        <div style={{
          flex: 1,
          height: '100%',
          position: 'relative',
        }}>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onConnect={onConnect}
          />
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedPhase && (
            <FlowDetailsPanel
              selectedNode={selectedPhase}
              onClose={closePanel}
              onUpdate={handleNodeUpdate}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        padding: '8px 12px',
        display: 'flex',
        gap: '16px',
        pointerEvents: 'none',
        zIndex: 50,
      }}>
        {[
          { color: 'var(--accent-success)', label: 'COMPLETED' },
          { color: 'var(--accent-primary)', label: 'ACTIVE' },
          { color: 'var(--text-dim)', label: 'PENDING' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: color }} />
            <span className="mono" style={{ fontSize: '10px' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
