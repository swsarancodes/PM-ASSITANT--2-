import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MigrationPhase } from '../types';
import { BookOpen, Code2, ShieldCheck, X, Pencil, Check, Plus, Trash2 } from 'lucide-react';

interface Props {
    selectedNode: MigrationPhase | null;
    onClose: () => void;
    onUpdate: (updated: MigrationPhase) => void;
}

const FlowDetailsPanel = ({ selectedNode, onClose, onUpdate }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<MigrationPhase | null>(null);

    if (!selectedNode) return null;

    const data = isEditing && editData ? editData : selectedNode;

    const startEditing = () => {
        setEditData({ ...selectedNode });
        setIsEditing(true);
    };

    const saveEdits = () => {
        if (editData) {
            onUpdate(editData);
        }
        setIsEditing(false);
        setEditData(null);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const updateField = (field: keyof MigrationPhase, value: any) => {
        if (editData) {
            setEditData({ ...editData, [field]: value });
        }
    };

    const updateListItem = (field: 'business_logic' | 'development_logic', index: number, value: string) => {
        if (editData) {
            const list = [...(editData[field] || [])];
            list[index] = value;
            setEditData({ ...editData, [field]: list });
        }
    };

    const addListItem = (field: 'business_logic' | 'development_logic') => {
        if (editData) {
            const list = [...(editData[field] || []), ''];
            setEditData({ ...editData, [field]: list });
        }
    };

    const removeListItem = (field: 'business_logic' | 'development_logic', index: number) => {
        if (editData) {
            const list = [...(editData[field] || [])];
            list.splice(index, 1);
            setEditData({ ...editData, [field]: list });
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 10px',
        background: 'var(--bg-base)',
        border: '1px solid var(--accent-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        outline: 'none',
    };

    const monoInputStyle: React.CSSProperties = {
        ...inputStyle,
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '420px',
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border-subtle)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>
                <div style={{ flex: 1 }}>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                        {data.id} — STRUCTURE PHASE
                    </span>
                    {isEditing ? (
                        <input
                            value={editData?.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                            style={{ ...inputStyle, fontSize: '18px', fontWeight: 600, marginTop: '6px' }}
                        />
                    ) : (
                        <h2 style={{ fontSize: '18px', marginTop: '6px' }}>{data.name}</h2>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                    {isEditing ? (
                        <>
                            <button onClick={saveEdits} style={{ color: 'var(--accent-success)', background: 'none', border: 'none', cursor: 'pointer' }} title="Save">
                                <Check size={18} />
                            </button>
                            <button onClick={cancelEditing} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} title="Cancel">
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={startEditing} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} title="Edit">
                                <Pencil size={16} />
                            </button>
                            <button onClick={onClose} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} title="Close">
                                <X size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                {/* Overview */}
                <section style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                        <BookOpen size={16} />
                        <span className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Overview</span>
                    </div>
                    {isEditing ? (
                        <textarea
                            value={editData?.description || ''}
                            onChange={(e) => updateField('description', e.target.value)}
                            rows={4}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                        />
                    ) : (
                        <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6' }}>
                            {data.description || 'No description provided.'}
                        </p>
                    )}
                </section>

                {/* Business Logic */}
                <section style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        color: 'var(--text-muted)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={16} />
                            <span className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Business Logic</span>
                        </div>
                        {isEditing && (
                            <button
                                onClick={() => addListItem('business_logic')}
                                style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Plus size={14} />
                                <span className="mono" style={{ fontSize: '10px' }}>ADD</span>
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(data.business_logic || []).length === 0 ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                {isEditing ? 'Click + ADD to add business logic rules' : 'No business logic defined'}
                            </div>
                        ) : (data.business_logic || []).map((logic, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '12px',
                                    background: 'var(--bg-base)',
                                    border: '1px solid var(--border-subtle)',
                                    fontSize: '13px',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {isEditing ? (
                                    <>
                                        <input
                                            value={logic}
                                            onChange={(e) => updateListItem('business_logic', i, e.target.value)}
                                            style={{ ...inputStyle, border: 'none', padding: '0', flex: 1 }}
                                        />
                                        <button
                                            onClick={() => removeListItem('business_logic', i)}
                                            style={{ color: 'var(--accent-amber)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <span style={{ flex: 1 }}>{logic}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Development Logic */}
                <section>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        color: 'var(--text-muted)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Code2 size={16} />
                            <span className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Development Logic</span>
                        </div>
                        {isEditing && (
                            <button
                                onClick={() => addListItem('development_logic')}
                                style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Plus size={14} />
                                <span className="mono" style={{ fontSize: '10px' }}>ADD</span>
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(data.development_logic || []).length === 0 ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                {isEditing ? 'Click + ADD to add development components' : 'No development logic defined'}
                            </div>
                        ) : (data.development_logic || []).map((step, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '8px 12px',
                                    borderLeft: '2px solid var(--accent-primary)',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    background: 'rgba(92, 124, 250, 0.05)',
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center',
                                }}
                            >
                                {isEditing ? (
                                    <>
                                        <input
                                            value={step}
                                            onChange={(e) => updateListItem('development_logic', i, e.target.value)}
                                            className="mono"
                                            style={{ ...monoInputStyle, border: 'none', padding: '0', flex: 1, background: 'transparent' }}
                                        />
                                        <button
                                            onClick={() => removeListItem('development_logic', i)}
                                            style={{ color: 'var(--accent-amber)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <span className="mono" style={{ flex: 1 }}>{step}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Status bar */}
            <div style={{
                padding: '12px 24px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    STATUS: {data.status?.toUpperCase() || 'UNKNOWN'}
                </span>
                {isEditing && (
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>
                        EDITING_MODE
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default FlowDetailsPanel;
