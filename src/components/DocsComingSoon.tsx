import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, FileText, Settings, Zap } from 'lucide-react';
import { Container, Section, H1, H2, Text, Button } from './styled';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(10px) rotate(-5deg); }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
  color: ${props => props.theme.colors.primary.white};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  text-align: center;
  max-width: 600px;
  padding: 2rem;
  z-index: 2;
  position: relative;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.accent.blue};
  margin-bottom: 1rem;
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(74, 144, 226, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.accent.blue};
  margin-bottom: 2rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.accent.blue};
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

const Title = styled(H1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, ${props => props.theme.colors.accent.blue}, ${props => props.theme.colors.primary.yellow});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #B0B0B0;
  margin-bottom: 2rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #888;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(74, 144, 226, 0.3);
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.accent.blue};
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.div`
  font-size: 0.9rem;
  color: #AAA;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, ${props => props.theme.colors.accent.blue}, #357ABD);
  color: ${props => props.theme.colors.primary.white};
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(74, 144, 226, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 2px solid ${props => props.theme.colors.accent.blue};
  color: ${props => props.theme.colors.accent.blue};
  
  &:hover {
    background: ${props => props.theme.colors.accent.blue};
    color: ${props => props.theme.colors.primary.white};
    transform: translateY(-2px);
  }
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingShape = styled.div<{ delay: number; size: number; top?: string; left?: string; right?: string; bottom?: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  ${props => props.top && `top: ${props.top};`}
  ${props => props.bottom && `bottom: ${props.bottom};`}
  ${props => props.left && `left: ${props.left};`}
  ${props => props.right && `right: ${props.right};`}
  background: radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const Footer = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  
  p {
    color: #666;
    font-size: 0.9rem;
    
    strong {
      color: ${props => props.theme.colors.accent.blue};
    }
  }
`;

const DocsComingSoon: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();

  return (
    <PageWrapper>
      <BackgroundAnimation>
        <FloatingShape delay={0} size={200} top="10%" left="10%" />
        <FloatingShape delay={2} size={150} top="60%" right="15%" />
        <FloatingShape delay={4} size={120} bottom="20%" left="20%" />
      </BackgroundAnimation>
      
      <ContentContainer>
        <Logo>📚 Axiom Loom</Logo>
        
        <StatusIndicator>
          <StatusDot />
          Documentation in Development
        </StatusIndicator>
        
        <Title>Implementation Guide Coming Soon</Title>
        <Subtitle>Comprehensive Documentation in Development</Subtitle>
        
        <Description>
          We're creating detailed implementation documentation for the AI Predictive Maintenance Architecture. 
          This comprehensive guide will include step-by-step deployment instructions, API references, 
          configuration examples, and best practices for enterprise implementation.
        </Description>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🚀</FeatureIcon>
            <FeatureTitle>Quick Start Guide</FeatureTitle>
            <FeatureDescription>Step-by-step deployment instructions</FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📖</FeatureIcon>
            <FeatureTitle>API Documentation</FeatureTitle>
            <FeatureDescription>Complete API reference with examples</FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>⚙️</FeatureIcon>
            <FeatureTitle>Configuration Guide</FeatureTitle>
            <FeatureDescription>Environment setup and customization</FeatureDescription>
          </FeatureCard>
        </FeatureGrid>

        <ButtonContainer>
          <StyledButton as={Link} to="/">
            <ArrowLeft size={20} />
            Back to Catalog
          </StyledButton>
          <SecondaryButton as={Link} to={`/repository/${repoName}`}>
            View Repository Details
          </SecondaryButton>
        </ButtonContainer>
        
        <Footer>
          <p>
            Need immediate support? Contact our technical team for assistance.<br />
            <strong>Expected Launch:</strong> Coming Soon
          </p>
        </Footer>
      </ContentContainer>
    </PageWrapper>
  );
};

export default DocsComingSoon;