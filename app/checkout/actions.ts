'use server'

import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface CheckoutItem {
  Id_prodotto: number;
  colore: string;
  Quantita: number;
  Nome: string;
  Prezzo: string;
  Path_immagine: string;
}

async function getUserData() {
  const cookieStore = cookies();
  const session = (await cookieStore).get('session');
  
  if (!session) redirect('/login');
  
  try {
    return JSON.parse(session.value);
  } catch {
    redirect('/login');
  }
}

export async function getCheckoutItems(): Promise<CheckoutItem[]> {
  const user = await getUserData();
  const userId = parseInt(user.id, 10);

  const [rows] = await db.query(`
    SELECT 
      c.Id_prodotto, c.colore, c.Quantità as Quantita, 
      p.Nome, p.Prezzo, p.Path_immagine
    FROM Carrelli c
    JOIN Prodotti p ON c.Id_prodotto = p.Id_Prodotti
    WHERE c.id_utente = ?
  `, [userId]);

  return rows as CheckoutItem[];
}

export async function processOrder(formData: FormData) {
  const user = await getUserData();
  const userId = parseInt(user.id, 10);
  const cartItems = await getCheckoutItems();
  
  if (!cartItems.length) throw new Error("Carrello vuoto");

  // Estraiamo l'indirizzo di spedizione dai campi del form (es. input con name="indirizzo")
  const shippingDetails = Object.fromEntries(formData.entries());
  const indirizzoSpedizione = (shippingDetails.indirizzo as string) || 'Indirizzo non specificato';

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Inserimento nella tabella 'ordini'
    const [orderResult]: any = await connection.execute(
      `INSERT INTO ordini (Indirizzo_spedizione, id_utente) VALUES (?, ?)`,
      [indirizzoSpedizione, userId]
    );

    const orderId = orderResult.insertId;

    // 2. Inserimento dei prodotti nella tabella di dettaglio 'Ordini_Prodotti'
    for (const item of cartItems) {
      await connection.execute(
        `INSERT INTO Ordini_Prodotti (Id_Ordini, Id_Prodotti, colore, Quantità) VALUES (?, ?, ?, ?)`,
        [orderId, item.Id_prodotto, item.colore, item.Quantita]
      );
    }

    // 3. Svuotamento del carrello dell'utente
    await connection.execute(`DELETE FROM Carrelli WHERE id_utente = ?`, [userId]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Errore durante il salvataggio dell\'ordine sul DB:', error);
    throw new Error('Impossibile completare l\'ordine.');
  } finally {
    connection.release();
  }

  revalidatePath('/checkout');
  revalidatePath('/profile');
  redirect('/success');
}