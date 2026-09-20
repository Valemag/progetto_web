'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/actions/userActions';
import { logoutUser } from '@/app/actions/authActions';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export default function UserProfileCard({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await updateUserProfile(user.id, name,surname , email);

    if (res.success) {
      setIsEditing(false);
    } else {
      setError(res.error || 'Errore imprevisto.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1, marginRight: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#262626', margin: 0 }}>
            Profilo Utente
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              aria-label="Modifica profilo"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#8C8583',
              }}
            >
              {/* Icona Matita SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <p style={{ color: '#D93025', fontSize: '13px', marginBottom: '10px' }}>{error}</p>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#8C8583', display: 'block' }}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E0D7D5',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#8C8583', display: 'block' }}>Cognome</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E0D7D5',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#8C8583', display: 'block' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E0D7D5',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#EC719C',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Salvataggio...' : 'Salva'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                   setSurname(user.surname);
                  setEmail(user.email);
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#524D4B',
                  border: '1px solid #E0D7D5',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Annulla
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: '#524D4B' }}>
            <p style={{ margin: 0 }}>
              <strong>Nome:</strong> {user.name}
            </p>
             <p style={{ margin: 0 }}>
              <strong>Cognome:</strong> {user.surname}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Ruolo:</strong> {user.role}
            </p>
          </div>
        )}
      </div>

      <form action={logoutUser}>
        <button
          type="submit"
          style={{
            backgroundColor: '#262626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Esci
        </button>
      </form>
    </div>
  );
}