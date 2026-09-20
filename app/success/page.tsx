import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2e7d32', fontSize: '2.5rem', marginBottom: '1rem' }}>
        Ordine completato con successo!
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
        Grazie per il tuo acquisto. Il tuo ordine è stato registrato correttamente.
      </p>
      <Link 
        href="/" 
        style={{ 
          background: '#000', 
          color: '#fff', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '4px', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Torna alla Home
      </Link>
    </div>
  );
}