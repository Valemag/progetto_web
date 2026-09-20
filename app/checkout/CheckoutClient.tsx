'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckoutItem, processOrder } from './actions';
import styles from './checkout.module.css';

interface Props {
  initialItems: CheckoutItem[];
  userEmail: string;
}

export default function CheckoutClient({ initialItems, userEmail }: Props) {
  const [country] = useState('Italy');
  const [province] = useState('Bari');

  const subtotal = initialItems.reduce(
    (acc, item) => acc + parseFloat(item.Prezzo) * item.Quantita,
    0
  );
  const total = subtotal;

  return (
    <div className={styles.layout}>
      {/* Colonna Sinistra: Form Dati Personali */}
      <div className={styles.leftColumn}>
        <form action={processOrder} className={styles.formContainer}>
          {/* Campi nascosti per trasferire articoli e totale alla Server Action */}
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(initialItems)}
          />
          <input type="hidden" name="total" value={total.toFixed(2)} />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Contact</h2>
              <a href="/login" className={styles.loginLink}>
                Sign in
              </a>
            </div>
            <input
              type="email"
              name="email"
              defaultValue={userEmail}
              placeholder="Email"
              className={styles.input}
              required
            />
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="news" /> Email me with news and offers
            </label>
          </section>

          <section className={styles.section}>
            <h2>Delivery</h2>
            <div className={styles.inputGroup}>
              <select
                name="country"
                className={styles.input}
                defaultValue={country}
              >
                <option value="Italy">Italy</option>
              </select>
            </div>

            <div className={styles.row}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className={styles.input}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className={styles.input}
                required
              />
            </div>

            <input
              type="text"
              name="company"
              placeholder="Company (optional)"
              className={styles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className={styles.input}
              required
            />
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              className={styles.input}
            />

            <div className={styles.rowThree}>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal code"
                className={styles.input}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className={styles.input}
                required
              />
              <select
                name="province"
                className={styles.input}
                defaultValue={province}
              >
                <option value="Bari">Bari</option>
                {/* Altre province... */}
              </select>
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className={styles.input}
              required
            />
          </section>

          {/* Sezione pagamento rimossa: l'ordine viene inoltrato direttamente */}
          <button type="submit" className={styles.submitBtn}>
            Conferma ordine
          </button>
        </form>
      </div>

      {/* Colonna Destra: Riepilogo Ordine */}
      <div className={styles.rightColumn}>
        <div className={styles.summaryContainer}>
          <div className={styles.itemsList}>
            {initialItems.map((item) => (
              <div
                key={`${item.Id_prodotto}-${item.colore}`}
                className={styles.itemRow}
              >
                <div className={styles.itemImageContainer}>
                  <div className={styles.quantityBadge}>{item.Quantita}</div>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.Path_immagine}
                      alt={item.Nome}
                      fill
                      className={styles.productImage}
                    />
                  </div>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.Nome}</span>
                  <span className={styles.itemColor}>Colour: {item.colore}</span>
                </div>
                <div className={styles.itemPrice}>
                  €{(parseFloat(item.Prezzo) * item.Quantita).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.discountSection}>
            <input
              type="text"
              placeholder="Discount code"
              className={styles.input}
            />
            <button type="button" className={styles.applyBtn}>
              Apply
            </button>
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.totalsRow}>
              <span>
                Subtotal -{' '}
                {initialItems.reduce((acc, item) => acc + item.Quantita, 0)}{' '}
                items
              </span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalsRow}>
              <span>Shipping</span>
              <span className={styles.shippingText}>Free</span>
            </div>
            <div className={`${styles.totalsRow} ${styles.finalTotal}`}>
              <span className={styles.totalLabel}>Total</span>
              <span>
                <span className={styles.currencyCode}>EUR</span>{' '}
                <strong>€{total.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}