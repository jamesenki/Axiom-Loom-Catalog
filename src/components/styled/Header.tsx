import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Home, RefreshCw, User, Key, LogOut } from 'lucide-react';
import theme from '../../styles/design-system/theme';
import { Container } from './index';
import { GlobalSearchModal } from '../GlobalSearchModal';
import { useAuth } from '../../contexts/BypassAuthContext';
import { UserRole } from '../../services/auth/clientAuthService';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
  border-bottom: 3px solid ${props => props.theme.colors.primary.yellow};
  box-shadow: ${props => props.theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
  
  /* Subtle animation on scroll */
  transition: ${props => props.theme.animations.transition.shadow};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]} 0;
  
  ${props => props.theme.breakpoints.down.md} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[4]};
    padding: ${props => props.theme.spacing[3]} 0;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.primary.white};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  transition: ${props => props.theme.animations.transition.transform};
  
  &:hover {
    transform: scale(1.02);
  }
  
  ${props => props.theme.breakpoints.down.md} {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.breakpoints.down.md} {
    gap: ${props => props.theme.spacing[2]};
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.primary.white};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: ${props => props.theme.animations.transition.all};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.primary.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: ${props => props.theme.animations.transition.all};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${props => props.theme.colors.primary.yellow};
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.yellow};
  }
  
  ${props => props.theme.breakpoints.down.sm} {
    padding: ${props => props.theme.spacing[2]};
    
    span {
      display: none;
    }
  }
`;

const Kbd = styled.kbd`
  font-size: ${props => props.theme.typography.fontSize.xs};
  padding: ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[1]};
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.sm};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  margin-left: ${props => props.theme.spacing[2]};
  
  ${props => props.theme.breakpoints.down.sm} {
    display: none;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.primary.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: ${props => props.theme.animations.transition.all};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${props => props.theme.colors.primary.yellow};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.yellow};
  }
`;

const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.primary.white};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  overflow: hidden;
  transform-origin: top right;
  transition: ${props => props.theme.animations.transition.all};
  opacity: ${props => props.isOpen ? 1 : 0};
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.95)'};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
`;

const UserInfo = styled.div`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  
  .name {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.gray[900]};
  }
  
  .email {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.gray[600]};
    margin-top: ${props => props.theme.spacing[0.5]};
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[700]};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: ${props => props.theme.animations.transition.all};
  
  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.primary.main};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[700]};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${props => props.theme.animations.transition.all};
  
  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.primary.main};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const RoleBadge = styled.span<{ role: UserRole }>`
  display: inline-block;
  padding: ${props => props.theme.spacing[0.5]} ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border-radius: ${props => props.theme.borderRadius.full};
  margin-left: ${props => props.theme.spacing[2]};
  
  ${props => {
    switch (props.role) {
      case UserRole.ADMIN:
        return `
          background: ${props => props.theme.colors.accent.red}20;
          color: ${props => props.theme.colors.accent.red};
        `;
      case UserRole.DEVELOPER:
        return `
          background: ${props => props.theme.colors.info.light};
          color: ${props => props.theme.colors.info.main};
        `;
      default:
        return `
          background: ${props => props.theme.colors.gray[200]};
          color: ${props => props.theme.colors.gray[700]};
        `;
    }
  }}
`;

const EYBrand = styled.span`
  color: ${props => props.theme.colors.primary.yellow};
  font-weight: ${props => props.theme.typography.fontWeight.black};
`;

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <HeaderContainer>
      <Container maxWidth='2xl'>
        <Nav>
          <Logo to="/">
            <LogoIcon>
              <EYBrand>AL</EYBrand>
            </LogoIcon>
            <div>
              <EYBrand>Axiom Loom</EYBrand> Catalog
            </div>
          </Logo>
          
          <NavActions>
            <NavLink to='/'>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            
            {isAuthenticated && hasRole(UserRole.ADMIN) && (
              <NavLink to='/sync'>
                <RefreshCw size={18} />
                <span>Sync</span>
              </NavLink>
            )}
            
            <SearchButton onClick={() => setShowSearch(true)}>
              <Search size={16} />
              <span>Search</span>
              <Kbd>⌘K</Kbd>
            </SearchButton>
            
            {isAuthenticated && user ? (
              <UserMenu data-user-menu>
                <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
                  <User size={18} />
                  <span>{user.name.split(' ')[0]}</span>
                </UserButton>
                
                <UserDropdown isOpen={showUserMenu}>
                  <UserInfo>
                    <div className="name">
                      {user.name}
                      <RoleBadge role={user.role}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </RoleBadge>
                    </div>
                    <div className="email">{user.email}</div>
                  </UserInfo>
                  
                  <DropdownItem to="/profile" onClick={() => setShowUserMenu(false)}>
                    <User />
                    Profile
                  </DropdownItem>
                  
                  {(hasRole(UserRole.DEVELOPER) || hasRole(UserRole.ADMIN)) && (
                    <DropdownItem to="/api-keys" onClick={() => setShowUserMenu(false)}>
                      <Key />
                      API Keys
                    </DropdownItem>
                  )}
                  
                  <DropdownButton onClick={handleLogout}>
                    <LogOut />
                    Sign Out
                  </DropdownButton>
                </UserDropdown>
              </UserMenu>
            ) : (
              <NavLink to='/login'>
                <User size={18} />
                <span>Sign In</span>
              </NavLink>
            )}
          </NavActions>
        </Nav>
      </Container>
      
      <GlobalSearchModal 
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </HeaderContainer>
  );
};

export default Header;