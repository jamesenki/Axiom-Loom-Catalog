import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
