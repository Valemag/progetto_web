'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/app/actions/authActions';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Stati del Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    if (isLogin) {
      // Logica Login
      const result = (await loginUser(formData)) as {
        success: boolean;
        user?: { id: number; name: string; email: string; role: string };
        error?: string;
      };

      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
      } else {
        alert(result.error || "Errore durante l'accesso");
      }
    } else {
      // Logica Registrazione
      formData.append('name', name); // Aggiungiamo anche il nome per la registrazione

      const result = (await registerUser(formData)) as {
        success: boolean;
        user?: { id: number; name: string; email: string; role: string };
        error?: string;
      };

      if (result.success) {
        alert('Registrazione completata con successo! Effettua il login.');
        setIsLogin(true); // Riporta l'utente alla schermata di accesso
      } else {
        alert(result.error || "Errore durante la registrazione");
      }
    }
  };
  return (
    <main
      style={{
        backgroundColor: '#FCF4F2',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          padding: '36px 28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Toggle Login / Registrazione */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#FCF4F2',
            borderRadius: '30px',
            padding: '4px',
            marginBottom: '28px',
          }}
        >
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: '26px',
              backgroundColor: isLogin ? '#262626' : 'transparent',
              color: isLogin ? '#ffffff' : '#8C8583',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Accedi
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: '26px',
              backgroundColor: !isLogin ? '#262626' : 'transparent',
              color: !isLogin ? '#ffffff' : '#8C8583',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Registrati
          </button>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '24px',
            color: '#262626',
          }}
        >
          {isLogin ? 'Bentornata/o!' : 'Crea un account'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#524D4B', marginBottom: '6px' }}>
                Nome e Cognome
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Maria Rossi"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E0D7D5',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#524D4B', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E0D7D5',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#524D4B', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E0D7D5',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#EC719C',
              color: '#ffffff',
              border: 'none',
              borderRadius: '30px',
              padding: '14px 0',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '12px',
            }}
          >
            {isLogin ? 'Accedi' : 'Registrati'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#8C8583', textDecoration: 'none' }}>
            ← Torna alla Home
          </Link>
        </div>
      </div>
    </main>
  );
}