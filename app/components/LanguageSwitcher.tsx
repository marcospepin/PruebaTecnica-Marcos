"use client";

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/i18n/request';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Set locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year
    // Refresh to apply new locale
    router.refresh();
  };

  return (
    <div style={{
      display: 'inline-flex',
      gap: '0.25rem',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '0.25rem',
      borderRadius: '12px',
      border: '1px solid rgba(199, 126, 1, 0.2)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          aria-label={`Switch to ${loc === 'es' ? 'Spanish' : 'English'}`}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: locale === loc ? 'linear-gradient(135deg, var(--accent-gold) 0%, #d4a200 100%)' : 'transparent',
            color: locale === loc ? '#1a1a1a' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontFamily: '"Sedan", serif',
            fontWeight: locale === loc ? '700' : '500',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: locale === loc ? '0 2px 8px rgba(199, 126, 1, 0.3)' : 'none',
            transform: locale === loc ? 'scale(1.02)' : 'scale(1)'
          }}
          onMouseEnter={(e) => {
            if (locale !== loc) {
              (e.target as HTMLButtonElement).style.background = 'rgba(199, 126, 1, 0.15)';
              (e.target as HTMLButtonElement).style.color = 'var(--accent-gold)';
              (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (locale !== loc) {
              (e.target as HTMLButtonElement).style.background = 'transparent';
              (e.target as HTMLButtonElement).style.color = 'var(--text-secondary)';
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }
          }}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
