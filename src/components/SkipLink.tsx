import React from 'react';
import { useTranslation } from 'react-i18next';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: 'var(--primary-color)',
        color: 'white',
        padding: '8px 16px',
        textDecoration: 'none',
        borderRadius: '8px',
        zIndex: 9999,
        fontWeight: 600,
        fontSize: '14px',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

export const SkipNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SkipLink href="#main-content">
        {t('Skip to main content')}
      </SkipLink>
      <SkipLink href="#navigation">
        {t('Skip to navigation')}
      </SkipLink>
    </>
  );
};

export default SkipNavigation;
