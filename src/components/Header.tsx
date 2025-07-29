import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <header style={{
      background: 'rgba(0,0,0,0.1)',
      padding: '10px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.2)'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🏢 EYNS AI Experience Center
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🏠 Home
          </Link>
          <Link to="/sync" style={{ color: 'white', textDecoration: 'none' }}>
            🔄 Sync
          </Link>
          <button
            onClick={() => setShowSearch(true)}
            style={{
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <Search size={16} />
            Search
            <kbd style={{
              fontSize: '11px',
              padding: '2px 4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '3px'
            }}>
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>
      
      <GlobalSearchModal 
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </header>
  );
};

export default Header;
