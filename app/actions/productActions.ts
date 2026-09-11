'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Definizione del tipo Prodotto
export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  created_at: Date;
};

// 1. READ (Ottieni tutti i prodotti)
export async function getProducts(): Promise<Product[]> {
  const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows as Product[];
}

// 2. CREATE (Aggiungi un nuovo prodotto)
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const imageUrl = formData.get('imageUrl') as string;

  await db.query(
    'INSERT INTO products (name, slug, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, slug, description, price, stock, imageUrl]
  );

  // Aggiorna la cache delle pagine per mostrare subito i nuovi dati
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
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
    [name, description, price, stock, imageUrl, id]
  );

  revalidatePath('/admin');
  revalidatePath('/shop');
}

// 4. DELETE (Elimina un prodotto)
export async function deleteProduct(id: number) {
  await db.query('DELETE FROM products WHERE id = ?', [id]);
  
  revalidatePath('/admin');
  revalidatePath('/shop');
}