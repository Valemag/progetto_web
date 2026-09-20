'use server'

import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Tipo per l'elemento del carrello
export interface CartItem {
  Id_prodotto: number;
  colore: string;
  Quantita: number;
  Nome: string;
  Prezzo: string; // MySQL DECIMAL torna come stringa per mantenere precisione
  Path_immagine: string;
}

// Funzione di utilità per estrarre l'utente (implementazione insicura come da tue specifiche)
async function getUserId(): Promise<number> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) throw new Error("Utente non autenticato");
  
  try {
    const user = JSON.parse(session.value);
    return parseInt(user.id, 10);
  } catch {
    throw new Error("Sessione non valida");
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  const userId =await getUserId();

  const [rows] = await db.query(`
    SELECT 
      c.Id_prodotto, 
      c.colore, 
      c.Quantità as Quantita, 
      p.Nome, 
      p.Prezzo, 
      p.Path_immagine
    FROM Carrelli c
    JOIN Prodotti p ON c.Id_prodotto = p.Id_Prodotti
    WHERE c.id_utente = ?
  `, [userId]);

  return rows as CartItem[];
}

export async function updateQuantity(productId: number, color: string, delta: number) {
  const userId =await getUserId();

  // Controlliamo la quantità attuale
  const [rows]: any = await db.query(
    `SELECT Quantità FROM Carrelli WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
    [userId, productId, color]
  );

  if (rows.length === 0) return;

  const newQuantity = rows[0].Quantità + delta;

  if (newQuantity <= 0) {
    await removeItem(productId, color);
  } else {
    await db.query(
      `UPDATE Carrelli SET Quantità = ? WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
      [newQuantity, userId, productId, color]
    );
    revalidatePath('/cart'); // Forza Next.js a ricaricare i dati della pagina
  }
}

export async function removeItem(productId: number, color: string) {
  const userId = await getUserId();
  await db.query(
    `DELETE FROM Carrelli WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
    [userId, productId, color]
  );
  revalidatePath('/cart');
}