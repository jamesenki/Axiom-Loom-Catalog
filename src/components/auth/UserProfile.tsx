/**
 * User Profile Component
 * Displays and manages user profile information
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/BypassAuthContext';
import { UserRole } from '../../services/auth/clientAuthService';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e1e4e8;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: 600;
`;

const UserInfo = styled.div`
  flex: 1;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #2e3440;
  }
  
  p {
    margin: 0;
    color: #6c757d;
    font-size: 16px;
  }
`;

const RoleBadge = styled.span<{ role: UserRole }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  margin-left: 12px;
  
  ${props => {
    switch (props.role) {
      case UserRole.ADMIN:
        return `
          background: #fee;
          color: #c00;
          border: 1px solid #fcc;
        `;
      case UserRole.DEVELOPER:
        return `
          background: #e7f3ff;
          color: #004085;
          border: 1px solid #b8daff;
        `;
      default:
        return `
          background: #f0f0f0;
          color: #666;
          border: 1px solid #ddd;
        `;
    }
  }}
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #2e3440;
  margin: 0 0 16px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  
  label {
    display: block;
    font-size: 13px;
    color: #6c757d;
    margin-bottom: 4px;
    font-weight: 600;
  }
  
  span {
    display: block;
    font-size: 15px;
    color: #2e3440;
  }
`;

const PermissionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
`;

const PermissionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 14px;
  color: #004085;
  
  &::before {
    content: '✓';
    color: #28a745;
    font-weight: bold;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`;

const UserProfile: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();

  if (!user) {
    return <ProfileContainer>Loading...</ProfileContainer>;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const permissions = {
    [UserRole.ADMIN]: [
      'Full system access',
      'User management',
      'API key management',
      'Repository management',
      'Security settings',
      'Analytics access',
      'Audit logs'
    ],
    [UserRole.DEVELOPER]: [
      'Read APIs & documentation',
      'Create API keys',
      'Manage own API keys',
      'Test APIs',
      'Download collections',
      'Access development tools'
    ],
    [UserRole.VIEWER]: [
      'Read APIs',
      'Read documentation',
      'View public content'
    ]
  };

  const userPermissions = permissions[user.role] || permissions[UserRole.VIEWER];

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>{getInitials(user.name)}</Avatar>
        <UserInfo>
          <h2>
            {user.name}
            <RoleBadge role={user.role}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </RoleBadge>
          </h2>
          <p>{user.email}</p>
        </UserInfo>
        <Button onClick={logout}>Sign Out</Button>
      </ProfileHeader>

      <Section>
        <SectionTitle>Account Information</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <label>User ID</label>
            <span>{user.id}</span>
          </InfoItem>
          <InfoItem>
            <label>Organization</label>
            <span>{user.organizationId || 'EY'}</span>
          </InfoItem>
          <InfoItem>
            <label>Account Created</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </InfoItem>
          <InfoItem>
            <label>Last Login</label>
            <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</span>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section>
        <SectionTitle>Permissions</SectionTitle>
        <PermissionsList>
          {userPermissions.map((permission, index) => (
            <PermissionItem key={index}>{permission}</PermissionItem>
          ))}
        </PermissionsList>
      </Section>

      <Section>
        <SectionTitle>API Rate Limits</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <label>Rate Limit</label>
            <span>
              {user.role === UserRole.ADMIN ? '1000' : 
               user.role === UserRole.DEVELOPER ? '500' : '100'} requests per 15 minutes
            </span>
          </InfoItem>
          <InfoItem>
            <label>API Key Limit</label>
            <span>
              {user.role === UserRole.ADMIN ? 'Unlimited' : 
               user.role === UserRole.DEVELOPER ? '10 keys' : 'N/A'}
            </span>
          </InfoItem>
        </InfoGrid>
      </Section>
    </ProfileContainer>
  );
};

export default UserProfile;