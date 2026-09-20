import { NextRequest, NextResponse } from 'next/server';
import {db} from '@/lib/db';
import { cookies } from 'next/headers';

// Funzione helper "ingenua" per estrarre l'ID dal cookie come da tua richiesta
async function  getUserId() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return null;
  try {
    const user = JSON.parse(session.value);
    return user.id;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  try {
    const [rows] = await db.query(
      `SELECT c.Id_prodotto, c.colore, c.Quantità, p.Nome, p.Prezzo, p.Path_immagine 
       FROM Carrelli c 
       JOIN Prodotti p ON c.Id_prodotto = p.Id_Prodotti 
       WHERE c.id_utente = ?`,
      [userId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Errore DB' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  try {
    const body = await req.json();
    const { action, id_prodotto, colore } = body;

    if (action === 'increment') {
      await db.query(
        `UPDATE Carrelli SET Quantità = Quantità + 1 WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
        [userId, id_prodotto, colore]
      );
    } else if (action === 'decrement') {
      // Controllo la quantità attuale
      const [rows]: any = await db.query(
        `SELECT Quantità FROM Carrelli WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
        [userId, id_prodotto, colore]
      );
      
      if (rows.length > 0) {
        if (rows[0].Quantità > 1) {
          await db.query(
            `UPDATE Carrelli SET Quantità = Quantità - 1 WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
            [userId, id_prodotto, colore]
          );
        } else {
          // Se la quantità arriva a 0, elimino come richiesto
          await db.query(
            `DELETE FROM Carrelli WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
            [userId, id_prodotto, colore]
          );
        }
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Errore DB' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id_prodotto = searchParams.get('id');
    const colore = searchParams.get('colore');

    await db.query(
      `DELETE FROM Carrelli WHERE id_utente = ? AND Id_prodotto = ? AND colore = ?`,
      [userId, id_prodotto, colore]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Errore DB' }, { status: 500 });
  }
}