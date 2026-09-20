'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Recupera l'utente da localStorage salvato al momento del login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Errore durante il parsing dell\'utente:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Rimuove il cookie impostando una data passata
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Logo / Link alla Home */}
      <Link href="/" style={{ fontSize: '20px', fontWeight: 700, color: '#262626', textDecoration: 'none' }}>
        MioStore
      </Link>

      {/* Sezione Utente in alto a destra */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Link al Profilo con Icona e Nome Utente */}
            <Link
              href="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: '#262626',
                backgroundColor: '#FCF4F2',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'background-color 0.2s',
              }}
            >
              {/* Icona Omino (SVG) */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EC719C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{user.name}</span>
            </Link>

            {/* Pulsante di Logout opzionale */}
            <button
              onClick={handleLogout}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#8C8583',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Esci
            </button>
          </div>
        ) : (
          /* Link al Login se non è loggato */
          <Link
            href="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#ffffff',
              backgroundColor: '#EC719C',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Accedi
          </Link>
        )}
      </div>
    </header>
  );
}