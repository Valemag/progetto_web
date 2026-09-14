'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Definizione del tipo Prodotto basato sui campi reali della tabella 'prodotti'
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

// 1. READ (Ottieni tutti i prodotti)
export async function getProducts(): Promise<Product[]> {
  const [rows]: any = await db.query(
    'SELECT Id_Prodotti AS id, Nome AS name, Descrizione AS description, Prezzo AS price, Quantita_magazzino AS stock, Path_immagine AS imageUrl FROM prodotti ORDER BY Id_Prodotti DESC'
  );
  return rows as Product[];
}

// 2. CREATE (Aggiungi un nuovo prodotto)
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const imageUrl = formData.get('imageUrl') as string;

  await db.query(
    'INSERT INTO prodotti (Nome, Descrizione, Prezzo, Path_immagine, Quantita_magazzino) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, imageUrl, stock]
  );

  revalidatePath('/admin');
  revalidatePath('/shop');
}

// 3. UPDATE (Aggiorna un prodotto esistente)
export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const imageUrl = formData.get('imageUrl') as string;

  await db.query(
    'UPDATE prodotti SET Nome = ?, Descrizione = ?, Prezzo = ?, Path_immagine = ?, Quantita_magazzino = ? WHERE Id_Prodotti = ?',
    [name, description, price, imageUrl, stock, id]
  );

  revalidatePath('/admin');
  revalidatePath('/shop');
}

// 4. DELETE (Elimina un prodotto)
export async function deleteProduct(id: number) {
  await db.query('DELETE FROM prodotti WHERE Id_Prodotti = ?', [id]);
  
  revalidatePath('/admin');
  revalidatePath('/shop');
}