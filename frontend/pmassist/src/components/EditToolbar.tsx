import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface Props {
    onAddNode: () => void;
    onDeleteNode: () => void;
    onSave: () => void;
    onBack: () => void;
    hasSelection: boolean;
    nodeCount: number;
}

const EditToolbar = ({ onAddNode, onDeleteNode, onSave, onBack, hasSelection, nodeCount }: Props) => {
    return (
        <div style={{
            height: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={onBack} className="toolbar-btn" title="Back to upload">
                    <ArrowLeft size={14} />
                </button>
                <span style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
                <button onClick={onAddNode} className="toolbar-btn" title="Add phase">
                    <Plus size={14} />
                    <span>Add Phase</span>
                </button>
                <button
                    onClick={onDeleteNode}
                    className="toolbar-btn"
                    disabled={!hasSelection}
                    title="Delete selected phase"
                    style={{ opacity: hasSelection ? 1 : 0.3 }}
                >
                    <Trash2 size={14} />
                    <span>Delete</span>
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    {nodeCount} PHASES
                </span>
                <button onClick={onSave} className="toolbar-btn toolbar-btn-primary" title="Save changes">
                    <Save size={14} />
                    <span>Save</span>
                </button>
            </div>

            <style>{`
        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 11px;
          background: transparent;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .toolbar-btn:hover:not(:disabled) {
          background: var(--bg-surface-hover);
        }
        .toolbar-btn:disabled {
          cursor: not-allowed;
        }
        .toolbar-btn-primary {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }
        .toolbar-btn-primary:hover {
          opacity: 0.9;
        }
      `}</style>
        </div>
    );
};

export default EditToolbar;
