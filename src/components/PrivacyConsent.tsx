/**
 * Privacy Consent Component
 * 
 * GDPR-compliant cookie consent banner with granular control
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Shield, Settings, Check } from 'lucide-react';
import { getAnalytics } from '../services/analytics/analyticsService';

const ConsentBanner = styled.div<{ minimized: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background.secondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: 1000;
  transform: translateY(${props => props.minimized ? 'calc(100% - 60px)' : '0'});
  transition: transform 0.3s ease;
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const MinimizedBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  cursor: pointer;
  background-color: ${props => props.theme.colors.primary};
  color: white;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ConsentOptions = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ConsentOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  flex-shrink: 0;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }

  &:disabled + span {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.border};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
`;

const OptionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: ${props.theme.colors.primary};
    color: white;
    border: none;

    &:hover {
      background-color: #E6D100;
    }
  ` : `
    background-color: transparent;
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.light};

    &:hover {
      background-color: ${props.theme.colors.background.secondary};
    }
  `}
`;

const PrivacyLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  performance: boolean;
}

interface PrivacyConsentProps {
  onConsentUpdate?: (consent: ConsentState) => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onConsentUpdate }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    functional: false,
    performance: false
  });

  useEffect(() => {
    // Check if consent has been previously given
    const storedConsent = localStorage.getItem('privacy_consent');
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setConsent(parsedConsent);
        applyConsent(parsedConsent);
      } catch (error) {
        setShowBanner(true);
      }
    }
  }, []);

  const applyConsent = (consentState: ConsentState) => {
    // Apply consent to analytics service
    const analytics = getAnalytics();
    analytics.setConsent(consentState.analytics);

    // Notify parent component
    if (onConsentUpdate) {
      onConsentUpdate(consentState);
    }

    // Apply other consent-based features
    if (consentState.performance) {
      // Enable performance monitoring
      console.log('Performance monitoring enabled');
    }

    if (consentState.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled');
    }
  };

  const handleConsentChange = (type: keyof ConsentState, value: boolean) => {
    if (type === 'necessary') return; // Necessary cookies cannot be disabled

    setConsent(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAcceptAll = () => {
    const allConsent: ConsentState = {
      necessary: true,
      analytics: true,
      functional: true,
      performance: true
    };
    
    setConsent(allConsent);
    saveAndApplyConsent(allConsent);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveAndApplyConsent(consent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const minimalConsent: ConsentState = {
      necessary: true,
      analytics: false,
      functional: false,
      performance: false
    };
    
    setConsent(minimalConsent);
    saveAndApplyConsent(minimalConsent);
    setShowBanner(false);
  };

  const saveAndApplyConsent = (consentState: ConsentState) => {
    localStorage.setItem('privacy_consent', JSON.stringify(consentState));
    localStorage.setItem('privacy_consent_date', new Date().toISOString());
    applyConsent(consentState);
  };

  if (!showBanner) return null;

  return (
    <ConsentBanner minimized={minimized}>
      {minimized ? (
        <MinimizedBar onClick={() => setMinimized(false)}>
          <span>Privacy Settings</span>
          <Settings size={20} />
        </MinimizedBar>
      ) : (
        <BannerContent>
          <HeaderRow>
            <Title>
              <Shield size={24} />
              Privacy & Cookie Settings
            </Title>
            <CloseButton onClick={() => setMinimized(true)}>
              <X size={20} />
            </CloseButton>
          </HeaderRow>

          <Description>
            We use cookies and similar technologies to enhance your experience, analyze site traffic, 
            and provide personalized content. You can choose which types of cookies you want to allow. 
            Learn more in our <PrivacyLink href="/privacy-policy" target="_blank">Privacy Policy</PrivacyLink>.
          </Description>

          <ConsentOptions>
            <ConsentOption>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={consent.necessary}
                  disabled
                />
                <ToggleSlider />
              </ToggleSwitch>
              <OptionContent>
                <OptionTitle>Necessary Cookies</OptionTitle>
                <OptionDescription>
                  Essential for the website to function properly. These cookies enable core functionality 
                  such as security, authentication, and session management.
                </OptionDescription>
              </OptionContent>
            </ConsentOption>

            <ConsentOption>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
              <OptionContent>
                <OptionTitle>Analytics Cookies</OptionTitle>
                <OptionDescription>
                  Help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. This helps us improve our services.
                </OptionDescription>
              </OptionContent>
            </ConsentOption>

            <ConsentOption>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={consent.functional}
                  onChange={(e) => handleConsentChange('functional', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
              <OptionContent>
                <OptionTitle>Functional Cookies</OptionTitle>
                <OptionDescription>
                  Enable enhanced functionality and personalization, such as remembering your preferences 
                  and settings across sessions.
                </OptionDescription>
              </OptionContent>
            </ConsentOption>

            <ConsentOption>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={consent.performance}
                  onChange={(e) => handleConsentChange('performance', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
              <OptionContent>
                <OptionTitle>Performance Cookies</OptionTitle>
                <OptionDescription>
                  Allow us to monitor website performance and loading times. This data helps us 
                  optimize the user experience.
                </OptionDescription>
              </OptionContent>
            </ConsentOption>
          </ConsentOptions>

          <ButtonRow>
            <Button variant="secondary" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button variant="secondary" onClick={handleAcceptSelected}>
              Accept Selected
            </Button>
            <Button variant="primary" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </ButtonRow>
        </BannerContent>
      )}
    </ConsentBanner>
  );
};

export default PrivacyConsent;