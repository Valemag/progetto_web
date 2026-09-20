'use client'

import { useTransition } from 'react';
import Image from 'next/image';
import { CartItem, updateQuantity, removeItem } from './actions';
import styles from './cart.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface CartClientProps {
  initialItems: CartItem[];
}

export default function CartClient({ initialItems }: CartClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  if (initialItems.length === 0) {
    return (
      <div className={styles.emptyCartContainer}>
        <h2>Carrello vuoto</h2>
      </div>
    );
  }

  const handleUpdate = (id: number, color: string, delta: number) => {
    startTransition(() => {
      updateQuantity(id, color, delta);
    });
  };

  const handleRemove = (id: number, color: string) => {
    startTransition(() => {
      removeItem(id, color);
    });
  };

  const totalCartPrice = initialItems.reduce((acc, item) => {
    return acc + (parseFloat(item.Prezzo) * item.Quantita);
  }, 0);

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>Il tuo Carrello</h1>
      
      <div className={styles.itemsList}>
        {initialItems.map((item) => {
          const itemTotal = parseFloat(item.Prezzo) * item.Quantita;

          return (
            <div key={`${item.Id_prodotto}-${item.colore}`} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={item.Path_immagine} 
                  alt={item.Nome} 
                  fill 
                  className={styles.productImage} 
                />
              </div>

              <div className={styles.itemDetails}>
                <div className={styles.itemHeader}>
                  <h3>{item.Nome}</h3>
                  <button 
                    onClick={() => handleRemove(item.Id_prodotto, item.colore)}
                    className={styles.deleteButton}
                    disabled={isPending}
                    aria-label="Rimuovi prodotto"
                  >
                    ✕
                  </button>
                </div>
                
                <p className={styles.itemColor}>Colore: {item.colore}</p>
                <p className={styles.itemPrice}>€{parseFloat(item.Prezzo).toFixed(2)}</p>

                <div className={styles.actionsContainer}>
                  <div className={styles.quantitySelector}>
                    <button 
                      onClick={() => handleUpdate(item.Id_prodotto, item.colore, -1)}
                      disabled={isPending}
                    >
                      -
                    </button>
                    <span>{item.Quantita}</span>
                    <button 
                      onClick={() => handleUpdate(item.Id_prodotto, item.colore, 1)}
                      disabled={isPending}
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.itemTotal}>
                    Totale: €{itemTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

     
    <div className={styles.cartSummary}>
      <h2>Totale Carrello: €{totalCartPrice.toFixed(2)}</h2>
      <Link href="/checkout" className={styles.checkoutButton}>
        Procedi al Checkout
      </Link>
    </div>
    </div>
  );
}