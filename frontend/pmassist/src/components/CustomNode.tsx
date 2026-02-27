import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { MigrationPhase } from '../types';
import { Activity, CheckCircle2, CircleDashed, AlertOctagon } from 'lucide-react';

const CustomNode = ({ data, selected }: NodeProps) => {
    const nodeData = data as unknown as MigrationPhase;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} style={{ color: 'var(--accent-success)' }} />;
            case 'in-progress': return <Activity size={14} style={{ color: 'var(--accent-primary)' }} />;
            case 'failed': return <AlertOctagon size={14} style={{ color: 'var(--accent-amber)' }} />;
            default: return <CircleDashed size={14} style={{ color: 'var(--text-dim)' }} />;
        }
    };

    const getBorderColor = () => {
        if (selected) return 'var(--accent-primary)';
        if (nodeData.type === 'input') return 'var(--text-muted)';
        if (nodeData.type === 'output') return 'var(--accent-success)';
        return 'var(--border-subtle)';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`node-card ${selected ? 'selected' : ''}`}
            style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${getBorderColor()}`,
                padding: '12px 16px',
                width: '240px',
                position: 'relative',
                transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
            }}
        >
            <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

            <div className="node-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="node-status-icon">{getStatusIcon(nodeData.status)}</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {nodeData.id}
                </span>
            </div>

            <div className="node-title" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                {nodeData.name || (data as any).label || `Phase ${nodeData.id}`}
            </div>

            <div className="node-preview" style={{ fontSize: '12px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                {nodeData.description || 'Click to view details'}
            </div>

            <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

            <style>{`
        .node-card:hover {
          border-color: var(--border-strong);
        }
        .node-card.selected {
          box-shadow: 0 0 0 2px rgba(92, 124, 250, 0.2);
        }
      `}</style>
        </motion.div>
    );
};

export default memo(CustomNode);
