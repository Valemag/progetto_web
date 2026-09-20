'use server';

import { db } from '@/lib/db'; 
import { ResultSetHeader } from 'mysql2';
import { cookies } from 'next/headers';
import { json } from 'stream/consumers';


// 1. LOGIN
export async function loginUser(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  try {
    const result: any = await db.execute(
      'SELECT id_utente AS id, nome AS name,cognome as surname,  email, password, ruolo AS role FROM utenti WHERE email = ?',
      [email]
    );
     console.log(email);
    // Gestione sicura del risultato vuoto o nullo
    if (!result) {
      return { success: false, error: 'Credenziali errate.' };
    }

    const users = Array.isArray(result[0]) ? result[0] : result;
    console.log('siamo qui');
    if (!Array.isArray(users) || users.length === 0) {
      return { success: false, error: 'Credenziali errate.' };
    }

    const user = users[0];
    
    if (String(user.password).trim() !== password) {
      return { success: false, error: 'Credenziali errate.' };
    }
    const cookieStore = await cookies();

  // 1. Scrivere un cookie (es. token di sessione)
  cookieStore.set('session', JSON.stringify(user), {
    httpOnly: true, // Impedisce l'accesso da JavaScript lato client (sicurezza XSS)
    maxAge: 60 * 60 * 24 * 7, // 1 settimana in secondi
    path: '/',
    sameSite: 'lax',
  });
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('ERRORE DATABASE LOGIN:', error);
    return { success: false, error: 'Errore di connessione al database.' };
  }
}

// 2. REGISTRAZIONE
export async function registerUser(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!name || !email || !password) {
    return { success: false, error: 'Compila tutti i campi.' };
  }

  const nameParts = name.split(' ');
  const nome = nameParts[0];
  const cognome = nameParts.slice(1).join(' ') || 'N/D';

  try {
    // 1. Controllo email con Optional Chaining per evitare il crash su undefined
    const existing: any = await db.execute('SELECT id_utente FROM utenti WHERE email = ?', [email]);
    
    // Se existing è nullo/undefined usa un array vuoto
    const existingRows = existing ? (Array.isArray(existing[0]) ? existing[0] : existing) : [];

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return { success: false, error: 'Email già registrata.' };
    }
console.log([nome, cognome, email, password, 'cliente']);
    // 2. Inserimento nuovo utente
    const insertResult: any = await db.execute<ResultSetHeader>(
      'INSERT INTO utenti (nome, cognome, email, password, ruolo) VALUES (?, ?, ?, ?, ?)',
      [nome, cognome, email, password, 'cliente']
    );

    const insertId = insertResult?.insertId || insertResult?.[0]?.insertId || Date.now();

    return {
      success: true,
      user: {
        id: insertId,
        name: `${nome} ${cognome}`,
        email: email,
        role: 'cliente',
      },
    };
  } catch (error) {
    console.error('ERRORE REGISTRAZIONE DB DETTAGLIATO:', error);
    return { success: false, error: 'Errore durante il salvataggio nel database.' };
  }
  // 3. LOGOUT

}
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}