import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import UserProfileCard from './UserProfilecard';

interface OrderItem {
  Nome: string;
  Prezzo: number;
  colore: string;
  Quantita: number;
}

interface Order {
  id: number;
  data: string;
  indirizzo_spedizione: string;
  items: OrderItem[];
}

async function getUserOrders(userId: number): Promise<Order[]> {
  try {
    // Recuperiamo la testata degli ordini e i relativi prodotti tramite JOIN
    const [rows]: [any[], any] = await db.execute(
      `SELECT 
         o.ID_ORDINI AS id, o.Data AS data, o.Indirizzo_spedizione AS indirizzo_spedizione,
         op.colore, op.Quantità AS Quantita,
         p.Nome, p.Prezzo
       FROM ordini o
       LEFT JOIN Ordini_Prodotti op ON o.ID_ORDINI = op.Id_Ordini
       LEFT JOIN Prodotti p ON op.Id_Prodotti = p.Id_Prodotti
       WHERE o.id_utente = ?
       ORDER BY o.Data DESC`,
      [userId]
    );

    // Raggruppiamo i prodotti per singolo ordine
    const ordersMap = new Map<number, Order>();

    for (const row of rows) {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          data: row.data,
          indirizzo_spedizione: row.indirizzo_spedizione,
          items: []
        });
      }
      if (row.Nome) {
        ordersMap.get(row.id)?.items.push({
          Nome: row.Nome,
          Prezzo: Number(row.Prezzo),
          colore: row.colore,
          Quantita: row.Quantita
        });
      }
    }

    return Array.from(ordersMap.values());
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    return [];
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie?.value) redirect('/login');

  let user: { id: number; name: string; surname: string; email: string; role: string } | null = null;
  try {
    user = JSON.parse(sessionCookie.value);
  } catch {
    redirect('/login');
  }

  if (!user) redirect('/login');

  const orders = await getUserOrders(user.id);

  return (
    <main style={{ backgroundColor: '#FCF4F2', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <UserProfileCard user={user} />

        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#262626', marginBottom: '16px' }}>
            I tuoi Ordini
          </h2>

          {orders.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#8C8583' }}>Nessun ordine trovato.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order) => {
                const totaleOrdine = order.items.reduce((acc, item) => acc + (item.Prezzo * item.Quantita), 0);
                
                return (
                  <div key={order.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E0D7D5', backgroundColor: '#FCF4F2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#262626' }}>
                        Ordine #{order.id}
                      </p>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#EC719C' }}>
                        €{totaleOrdine.toFixed(2)}
                      </p>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#8C8583' }}>
                      Data: {new Date(order.data).toLocaleDateString('it-IT')}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#8C8583' }}>
                      Spedizione a: {order.indirizzo_spedizione}
                    </p>
                    <div style={{ borderTop: '1px solid #E0D7D5', paddingTop: '8px', marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#262626', marginBottom: '4px' }}>Prodotti:</p>
                      {order.items.map((item, idx) => (
                        <p key={idx} style={{ margin: '2px 0', fontSize: '12px', color: '#555' }}>
                          • {item.Nome} ({item.colore}) x {item.Quantita} - €{(item.Prezzo * item.Quantita).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#8C8583', textDecoration: 'none' }}>
            ← Torna alla Home
          </Link>
        </div>
      </div>
    </main>
  );
}