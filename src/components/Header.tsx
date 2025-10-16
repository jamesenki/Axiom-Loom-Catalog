import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Home, RefreshCw, Activity, Book, Cpu } from 'lucide-react';
import styled, { keyframes, css } from 'styled-components';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AxiomLogo } from './AxiomLogo';
import { GlassButton } from './styled/QuantumButton';
import { quantumColors } from '../styles/axiom-theme';

// Keyframes animations
const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
`;

// Glass morphism header container
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(
    180deg, 
    rgba(10, 10, 27, 0.95) 0%,
    rgba(20, 20, 41, 0.85) 100%
  );
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 4px 30px rgba(139, 92, 246, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.5);
  animation: ${css`${slideDown}`} 0.5s ease-out;
`;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  height: 80px;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: ${props => props.isActive ? quantumColors.plasma.cyan : quantumColors.neural.light};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 12px;
  background: ${props => props.isActive 
    ? `linear-gradient(135deg, ${quantumColors.plasma.violet}20, ${quantumColors.plasma.cyan}20)`
    : 'transparent'};
  border: 1px solid ${props => props.isActive 
    ? `${quantumColors.plasma.cyan}40`
    : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      ${quantumColors.plasma.violet}20,
      ${quantumColors.plasma.cyan}20
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    color: ${quantumColors.plasma.cyan};
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(10deg) scale(1.1);
  }
`;

const SearchButton = styled(GlassButton)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1),
    rgba(6, 182, 212, 0.1)
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  
  &:hover {
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.2),
      rgba(6, 182, 212, 0.2)
    );
    border-color: ${quantumColors.plasma.cyan};
    box-shadow: 
      0 0 20px rgba(139, 92, 246, 0.4),
      0 0 40px rgba(6, 182, 212, 0.2);
  }
`;

const KeyboardHint = styled.kbd`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2),
    rgba(6, 182, 212, 0.1)
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  color: ${quantumColors.neural.bright};
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: ${quantumColors.plasma.emerald};
  border-radius: 50%;
  box-shadow: 0 0 10px ${quantumColors.plasma.emerald};
  animation: ${css`${pulse}`} 2s infinite;
`;

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

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

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Check if we're on landing page or resume page - these should show simple header
  const isLandingOrResume = location.pathname === '/' || location.pathname === '/resume';

  return (
    <HeaderContainer>
      <NavContainer>
        <LogoLink to="/">
          <AxiomLogo size="medium" showText={true} gradient={true} />
        </LogoLink>

        {isLandingOrResume ? (
          // Simple header for landing/resume pages
          <NavLinks>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.5px'
            }}>
              Professional Portfolio
            </div>
          </NavLinks>
        ) : (
          // Full navigation for catalog pages
          <NavLinks>
            <NavLink to="/" isActive={isActive('/')}>
              <Home size={18} />
              Home
            </NavLink>

            <NavLink to="/repositories" isActive={isActive('/repositories')}>
              <Cpu size={18} />
              Repositories
            </NavLink>

            <NavLink to="/apis" isActive={isActive('/apis')}>
              <Activity size={18} />
              APIs
            </NavLink>

            <NavLink to="/docs" isActive={isActive('/docs')}>
              <Book size={18} />
              Docs
            </NavLink>

            <NavLink to="/sync" isActive={isActive('/sync')}>
              <RefreshCw size={18} />
              Sync
              {location.pathname === '/sync' && <StatusIndicator />}
            </NavLink>

            <SearchButton
              onClick={() => setShowSearch(true)}
              size="sm"
            >
              <Search size={16} />
              Search
              <KeyboardHint>⌘K</KeyboardHint>
            </SearchButton>
          </NavLinks>
        )}
      </NavContainer>
      
      <GlobalSearchModal 
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </HeaderContainer>
  );
};

export default Header;