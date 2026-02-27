import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileUp, ArrowRight, Cpu, GitBranch, Layers, Sun, Moon } from 'lucide-react';

interface Props {
    onUpload: (file: File) => void;
    isAnalyzing: boolean;
}

const LandingPage = ({ onUpload, isAnalyzing }: Props) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
    });

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.name.match(/\.(ppt|pptx)$/i)) {
            setFileName(file.name);
            onUpload(file);
        }
    }, [onUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onUpload(file);
        }
    }, [onUpload]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'var(--bg-base)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Grid background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
          linear-gradient(var(--border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
        `,
                backgroundSize: '60px 60px',
                opacity: 0.3,
            }} />

            {/* Top bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 32px',
                    gap: '12px',
                    zIndex: 10,
                }}
            >
                <Cpu size={20} style={{ color: 'var(--accent-primary)' }} />
                <span className="mono" style={{ fontSize: '13px', letterSpacing: '3px', color: 'var(--text-primary)' }}>
                    PM_ASSISTANT
                </span>
                <span style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 8px' }} />
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '2px' }}>
                    PROJECT_ANALYSIS_ENGINE
                </span>
                <div style={{ marginLeft: 'auto' }}>
                    <button onClick={toggleTheme} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', border: '1px solid var(--border-subtle)',
                        background: 'transparent', color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer',
                    }}>
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '48px',
                    zIndex: 10,
                    maxWidth: '700px',
                    width: '100%',
                    padding: '0 32px',
                }}
            >
                {/* Title block */}
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '36px',
                        letterSpacing: '6px',
                        marginBottom: '16px',
                        fontWeight: 700,
                    }}>
                        PM
                        <br />
                        <span style={{ color: 'var(--accent-primary)' }}>ASSISTANT</span>
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        lineHeight: '1.8',
                        maxWidth: '500px',
                        margin: '0 auto',
                    }}>
                        Upload your project presentation to generate a structured project roadmap
                        with editable phases, business logic, and development workflows.
                    </p>
                </div>

                {/* Upload zone */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".ppt,.pptx"
                    style={{ display: 'none' }}
                />

                {isAnalyzing ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            width: '100%',
                            padding: '60px 40px',
                            border: '1px solid var(--accent-primary)',
                            background: 'rgba(92, 124, 250, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px',
                        }}
                    >
                        <div className="mono" style={{
                            fontSize: '13px',
                            letterSpacing: '4px',
                            color: 'var(--accent-primary)',
                        }}>
                            ANALYZING_{fileName?.toUpperCase().replace(/\./g, '_') || 'PROJECT'}
                        </div>
                        <div style={{
                            width: '280px',
                            height: '2px',
                            background: 'var(--border-subtle)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: '100%',
                                    background: 'var(--accent-primary)',
                                }}
                            />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                            Extracting flows, business logic, and development components...
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        whileHover={{ borderColor: 'var(--accent-primary)' }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%',
                            padding: '60px 40px',
                            border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-strong)'}`,
                            background: isDragging ? 'rgba(92, 124, 250, 0.05)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'all var(--transition-base)',
                        }}
                    >
                        <div style={{
                            width: '56px',
                            height: '56px',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {isDragging ? (
                                <FileUp size={24} style={{ color: 'var(--accent-primary)' }} />
                            ) : (
                                <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                            )}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                                {isDragging ? 'Drop your file here' : 'Drop a .ppt or .pptx file here'}
                            </div>
                            <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                                OR_CLICK_TO_BROWSE
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '4px',
                            marginTop: '8px',
                        }}>
                            {['.PPT', '.PPTX'].map(ext => (
                                <span key={ext} className="mono" style={{
                                    fontSize: '10px',
                                    padding: '2px 8px',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-dim)',
                                }}>
                                    {ext}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Feature indicators */}
                <div style={{
                    display: 'flex',
                    gap: '32px',
                    justifyContent: 'center',
                }}>
                    {[
                        { icon: <GitBranch size={16} />, label: 'FLOW_MAPPING' },
                        { icon: <Layers size={16} />, label: 'LOGIC_EXTRACTION' },
                        { icon: <ArrowRight size={16} />, label: 'PHASE_PLANNING' },
                    ].map(({ icon, label }) => (
                        <div key={label} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--text-dim)',
                        }}>
                            {icon}
                            <span className="mono" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Bottom version */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                display: 'flex',
                gap: '16px',
            }}>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    SYS_VERSION_2.0.1
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>|</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    ENGINE_STATUS: ONLINE
                </span>
            </div>
        </div>
    );
};

export default LandingPage;
