'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, addToCart } from '@/app/actions/productActions';

export default function AddToCartForm({ product, isAdmin }: { product: Product; isAdmin?: boolean }) {
  const router = useRouter();

  // 1. Stati locali per Variante e Quantità
  const [selectedChain, setSelectedChain] = useState<'Argentata' | 'Dorata'>('Argentata');
  const [quantity, setQuantity] = useState<number>(1);

  // 2. Incremento e Decremento
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // 3. Salvataggio nel Carrello e Reindirizzamento
  const handleAddToCart = () => {
    if (isAdmin) return;
    addToCart(product.id, selectedChain, quantity);
  };

  return (
    <div>
      {/* Opzioni Varianti */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#524D4B',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          COLORE CATENA
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            disabled={isAdmin}
            onClick={() => setSelectedChain('Argentata')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1px solid #262626',
              backgroundColor: selectedChain === 'Argentata' ? '#262626' : 'transparent',
              color: selectedChain === 'Argentata' ? '#ffffff' : '#262626',
              fontSize: '13px',
              fontWeight: 500,
              cursor: isAdmin ? 'not-allowed' : 'pointer',
              opacity: isAdmin ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            Argentata
          </button>
          <button
            type="button"
            disabled={isAdmin}
            onClick={() => setSelectedChain('Dorata')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: selectedChain === 'Dorata' ? '1px solid #262626' : '1px solid #E0D7D5',
              backgroundColor: selectedChain === 'Dorata' ? '#262626' : 'transparent',
              color: selectedChain === 'Dorata' ? '#ffffff' : '#262626',
              fontSize: '13px',
              fontWeight: 500,
              cursor: isAdmin ? 'not-allowed' : 'pointer',
              opacity: isAdmin ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            Dorata
          </button>
        </div>
      </div>

      {/* Quantità */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#524D4B',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          QUANTITÀ
        </label>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid #E0D7D5',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '14px',
          }}
        >
          <button
            type="button"
            disabled={isAdmin}
            onClick={handleDecrease}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: '#524D4B',
              cursor: isAdmin ? 'not-allowed' : 'pointer',
              padding: '0 4px',
              opacity: isAdmin ? 0.5 : 1,
            }}
          >
            -
          </button>
          <span style={{ width: '16px', textAlign: 'center', fontWeight: 500 }}>
            {quantity}
          </span>
          <button
            type="button"
            disabled={isAdmin}
            onClick={handleIncrease}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: '#524D4B',
              cursor: isAdmin ? 'not-allowed' : 'pointer',
              padding: '0 4px',
              opacity: isAdmin ? 0.5 : 1,
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Pulsante Aggiungi al carrello disabilitato se isAdmin è true */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdmin}
        style={{
          width: '100%',
          backgroundColor: isAdmin ? '#E0D7D5' : '#EC719C',
          color: isAdmin ? '#8C8583' : '#ffffff',
          border: 'none',
          borderRadius: '30px',
          padding: '16px 0',
          fontSize: '15px',
          fontWeight: 600,
          cursor: isAdmin ? 'not-allowed' : 'pointer',
          marginBottom: '32px',
          opacity: isAdmin ? 0.7 : 1,
        }}
      >
        {isAdmin ? '🔒 Acquisto disabilitato per Admin' : 'Aggiungi al carrello'}
      </button>
    </div>
  );
}