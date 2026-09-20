'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(userId: number, name: string,surname: string, email: string) {
  if (!name.trim() || !email.trim()) {
    return { success: false, error: 'I campi non possono essere vuoti.' };
  }

  try {
    // Verifica il nome della colonna nel tuo DB ('nome' o 'name')
    await db.execute(
      'UPDATE utenti SET nome = ?,cognome = ?, email = ? WHERE id_utente = ?',
      [name,surname, email, userId]
    );

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    let currentData = {};

    if (sessionCookie?.value) {
      try {
        currentData = JSON.parse(sessionCookie.value);
      } catch {
        currentData = {};
      }
    }

    const updatedUser = {
      ...currentData,
      id: userId,
      name,
      surname,
      email,
    };
    

   cookieStore.set('session', JSON.stringify(updatedUser), {
    httpOnly: true, // Impedisce l'accesso da JavaScript lato client (sicurezza XSS)
    maxAge: 60 * 60 * 24 * 7, // 1 settimana in secondi
    path: '/',
    sameSite: 'lax',
  });

    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    return { success: false, error: 'Impossibile aggiornare i dati.' };
  }
}