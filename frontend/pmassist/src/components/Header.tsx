import type { ProjectMetadata } from '../types';
import { History, Share2, Upload, Sun, Moon } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface Props {
    metadata: ProjectMetadata;
    onUpload: (file: File) => void;
}

const Header = ({ metadata, onUpload }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <header style={{
            height: '80px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-base)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
            justifyContent: 'space-between'
        }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".ppt,.pptx"
                style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', letterSpacing: '2px', margin: 0 }}>
                        {metadata.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            SCOPE: {metadata.scope}
                        </span>
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                            {metadata.status}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="header-btn" onClick={toggleTheme} title="Toggle theme">
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="mono">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
                <button className="header-btn" onClick={handleUploadClick}>
                    <Upload size={16} />
                    <span className="mono">Upload PPT</span>
                </button>
                <button className="header-btn">
                    <History size={16} />
                    <span className="mono">Revisions</span>
                </button>
                <button className="header-btn" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none' }}>
                    <Share2 size={16} />
                    <span className="mono">Export</span>
                </button>
            </div>

            <style>{`
        .header-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 12px;
          transition: background var(--transition-fast);
        }
        .header-btn:hover {
          background: var(--bg-surface-hover);
        }
      `}</style>
        </header>
    );
};

export default Header;
