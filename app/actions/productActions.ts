'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};
export async function addToCart(id_prodotto: number, colore: string, quantita: number) {
  // 1. Reperire l'id utente dal cookie 'session'
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie || !sessionCookie.value) {
    throw new Error("Errore: Cookie di sessione mancante. Utente non autenticato.");
  }

  let userId: number;
  try {
    const user = JSON.parse(sessionCookie.value);
    if (!user.id) {
      throw new Error("ID utente mancante nel cookie");
    }
    userId = parseInt(user.id, 10);
  } catch (error) {
    throw new Error("Errore: Formato del cookie di sessione non valido o ID mancante.");
  }

  // 2. Controllare che la quantità non sia 0 o negativa
  if (quantita <= 0) {
    throw new Error("Errore: La quantità da aggiungere deve essere maggiore di zero.");
  }

  // 3. Inserimento o aggiornamento della riga
  try {
    // Usiamo ON DUPLICATE KEY UPDATE: se la Primary Key (id_utente, Id_prodotto, colore)
    // esiste già, MySQL eseguirà l'update della quantità invece di dare errore.
    await db.query(
      `INSERT INTO Carrelli (id_utente, Id_prodotto, colore, Quantità)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE Quantità = Quantità + VALUES(Quantità)`,
      [userId, id_prodotto, colore, quantita]
    );
  } catch (error) {
    console.error("Errore Database durante l'aggiunta al carrello:", error);
    throw new Error("Errore interno del server durante l'aggiornamento del carrello.");
  }

  // 4. Ritornare alla route /cart (effettua un redirect HTTP 303)
  redirect('/cart');
}
// Funzione ausiliaria per salvare i file nella cartella public/uploads
async function saveUploadedFile(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
// 5. READ SINGLE PRODUCT (Dettaglio prodotto)
export async function getProductById(id: number): Promise<Product | null> {
  const [rows]: any = await db.query(
    'SELECT Id_Prodotti AS id, Nome AS name, Descrizione AS description, Prezzo AS price, Quantita_magazzino AS stock, Path_immagine AS imageUrl FROM prodotti WHERE Id_Prodotti = ?',
    [id]
  );
  return rows.length > 0 ? (rows[0] as Product) : null;
}

// 1. READ
export async function getProducts(): Promise<Product[]> {
  const [rows]: any = await db.query(
    'SELECT Id_Prodotti AS id, Nome AS name, Descrizione AS description, Prezzo AS price, Quantita_magazzino AS stock, Path_immagine AS imageUrl FROM prodotti ORDER BY Id_Prodotti DESC'
  );
  return rows as Product[];
}

// 2. CREATE
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const imageFile = formData.get('imageFile') as File;

  const uploadedPath = await saveUploadedFile(imageFile);
  const imageUrl = uploadedPath || '/placeholder.jpg';

  await db.query(
    'INSERT INTO prodotti (Nome, Descrizione, Prezzo, Path_immagine) VALUES (?, ?, ?, ?)',
    [name, description, price, imageUrl]
  );

  revalidatePath('/admin');
  revalidatePath('/shop');
}

// 3. UPDATE
export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);

  
  const currentImageUrl = formData.get('currentImageUrl') as string;
  const imageFile = formData.get('imageFile') as File;

  let imageUrl = currentImageUrl;

  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveUploadedFile(imageFile);
    if (uploadedPath) {
      imageUrl = uploadedPath;
    }
  }

  await db.query(
    'UPDATE prodotti SET Nome = ?, Descrizione = ?, Prezzo = ?, Path_immagine = ? WHERE Id_Prodotti = ?',
    [name, description, price, imageUrl, id]
  );

  revalidatePath('/admin');
  revalidatePath('/shop');
}

// 4. DELETE
export async function deleteProduct(id: number) {
  await db.query('DELETE FROM prodotti WHERE Id_Prodotti = ?', [id]);
  
  revalidatePath('/admin');
  revalidatePath('/shop');
}