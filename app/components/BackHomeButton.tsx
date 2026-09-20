import Link from 'next/link';

export default function BackHomeButton() {
  return (
    <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}>
      <Link 
        href="/" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          color: '#262626',
          padding: '8px 14px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #E0D7D5',
          fontFamily: 'sans-serif',
        }}
      >
        ← Home
      </Link>
    </div>
  );
}