// components/AdminLogoutButton.tsx
'use client'

import { logoutUser } from '@/app/actions/authActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await logoutUser(); // Esegue solo la pulizia del cookie nel backend
    } catch (error) {
      // Ignora l'errore di redirect se lanciato dal server
    } finally {
      router.push('/login'); // Reindirizzamento gestito interamente dal client
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      style={{
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        padding: '8px 16px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '13px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      {isPending ? 'Uscita in corso...' : '🚪 Logout'}
    </button>
  );
}