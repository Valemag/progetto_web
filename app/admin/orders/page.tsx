import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';

interface AdminOrderItem {
  nome_prodotto: string;
  colore: string;
  quantita: number;
  prezzo: number;
}

interface AdminOrder {
  id: number;
  data: string;
  indirizzo: string;
  nomeCliente: string;
  cognomeCliente: string;
  emailCliente: string;
  items: AdminOrderItem[];
}

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie?.value) redirect('/login');

  let user: { role?: string } | null = null;
  try {
    user = JSON.parse(sessionCookie.value);
  } catch {
    redirect('/login');
  }

  // Controllo permessi admin (regola basata sulla struttura della sessione)
  if (!user || user.role !== 'admin') {
    redirect('/profile');
  }

  // Estraiamo tutti gli ordini con i relativi dettagli uniti
  const [rows]: [any[], any] = await db.execute(
    `SELECT 
       o.ID_ORDINI AS id, o.Data AS data, o.Indirizzo_spedizione AS indirizzo,
       u.nome, u.cognome, u.email,
       op.colore, op.Quantità AS quantita,
       p.Nome AS nome_prodotto, p.Prezzo
     FROM ordini o
     JOIN Utenti u ON o.id_utente = u.id_utente
     JOIN Ordini_Prodotti op ON o.ID_ORDINI = op.Id_Ordini
     JOIN Prodotti p ON op.Id_Prodotti = p.Id_Prodotti
     ORDER BY o.Data DESC`
  );

  // Raggruppiamo i record per ID Ordine per una visualizzazione pulita in stile "Lista da preparare"
  const ordersMap = new Map<number, AdminOrder>();

  for (const row of rows) {
    if (!ordersMap.has(row.id)) {
      ordersMap.set(row.id, {
        id: row.id,
        data: row.data,
        indirizzo: row.indirizzo,
        nomeCliente: row.nome,
        cognomeCliente: row.cognome,
        emailCliente: row.email,
        items: []
      });
    }
    if (row.nome_prodotto) {
      ordersMap.get(row.id)?.items.push({
        nome_prodotto: row.nome_prodotto,
        colore: row.colore,
        quantita: row.quantita,
        prezzo: Number(row.Prezzo)
      });
    }
  }

  const ordersToPrepare = Array.from(ordersMap.values());

  return (
    <main style={{ padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#FCF4F2', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#262626', marginBottom: '8px' }}>
          Ordini da Preparare 📦
        </h1>
        <p style={{ fontSize: '14px', color: '#8C8583', marginBottom: '24px' }}>
          Elenco di tutti gli ordini ricevuti da evadere e preparare per la spedizione.
        </p>
        
        {ordersToPrepare.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: '#8C8583', fontSize: '14px' }}>Nessun ordine da preparare al momento.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ordersToPrepare.map((order) => (
              <div 
                key={order.id} 
                style={{ 
                  background: '#fff', 
                  padding: '20px', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px solid #E0D7D5'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#262626' }}>
                    Ordine #{order.id}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#8C8583' }}>
                    {new Date(order.data).toLocaleString('it-IT')}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px', background: '#FCF4F2', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Cliente:</strong> {order.nomeCliente} {order.cognomeCliente} ({order.emailCliente})</p>
                  <p style={{ margin: 0 }}><strong>Indirizzo di Spedizione:</strong> {order.indirizzo}</p>
                </div>

                <div style={{ borderTop: '1px solid #E0D7D5', paddingTop: '10px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#262626', marginBottom: '6px' }}>
                    Articoli da preparare:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#444' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <strong>{item.quantita}x</strong> {item.nome_prodotto} — <span style={{ color: '#EC719C', fontWeight: 600 }}>Colore: {item.colore}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/profile" style={{ fontSize: '13px', color: '#8C8583', textDecoration: 'none' }}>
            ← Torna al Profilo
          </Link>
        </div>
      </div>
    </main>
  );
}