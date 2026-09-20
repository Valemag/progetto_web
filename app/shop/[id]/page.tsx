import { getProductById } from '@/app/actions/productActions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartForm from './AddToCartForm';
import { cookies } from 'next/headers';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }
// Leggi la sessione per determinare se l'utente è admin
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  let isAdmin = false;
  if (sessionCookie?.value) {
    try {
      const user = JSON.parse(sessionCookie.value);
      isAdmin = user.role === 'admin';
    } catch {
      isAdmin = false;
    }
  }
  return (
    <main
      style={{
        backgroundColor: '#FCF4F2',
        minHeight: '100vh',
        padding: '40px 20px 80px 20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#262626',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: '13px',
            color: '#8C8583',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link href="/" style={{ color: '#8C8583', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" style={{ color: '#8C8583', textDecoration: 'none' }}>
            Shop
          </Link>
          <span>/</span>
          <span style={{ color: '#262626', fontWeight: 500 }}>
            {product.name}
          </span>
        </nav>

        {/* Layout Griglia */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Immagine Prodotto */}
          <div style={{ width: '100%' }}>
            <img
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '620px',
                objectFit: 'cover',
                borderRadius: '28px',
                display: 'block',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            />
          </div>

          {/* Dettagli Prodotto */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          

            <h1
              style={{
                fontSize: '42px',
                fontWeight: 700,
                lineHeight: 1.1,
                margin: '0 0 16px 0',
                letterSpacing: '-0.5px',
                color: '#262626',
              }}
            >
              {product.name}
            </h1>

            {/* Prezzo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#EC719C',
                }}
              >
               {product.price}
              </span>
            
            </div>

            {/* Descrizione */}
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#524D4B',
                marginBottom: '24px',
              }}
            >
              {product.description}
            </p>
        
        
       
           <AddToCartForm product={product} isAdmin={isAdmin} />

            {/* Accordion / Informazioni Aggiuntive */}
            <div style={{ borderTop: '1px solid #E0D7D5' }}>
              <details
                open
                style={{
                  borderBottom: '1px solid #E0D7D5',
                }}
              >
                <summary
                  style={{
                    padding: '16px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    listStyle: 'none',
                  }}
                >
                  <span>Descrizione</span>
                  <span style={{ color: '#EC719C', fontSize: '18px' }}>+</span>
                </summary>
                <div
                  style={{
                    paddingBottom: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#66605E',
                  }}
                >
                  <p style={{ margin: '0 0 8px 0' }}>{product.description}</p>
                  <p style={{ margin: 0 }}>
                    <strong>Dimensions bag:</strong> approx. 22 cm x 4 cm x 12 cm
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Dimensions strap:</strong> approx. 100 cm x 3 cm x 1 cm
                  </p>
                </div>
              </details>

              <details style={{ borderBottom: '1px solid #E0D7D5' }}>
                <summary
                  style={{
                    padding: '16px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    listStyle: 'none',
                  }}
                >
                  <span>Resi</span>
                  <span style={{ color: '#EC719C', fontSize: '18px' }}>+</span>
                </summary>
                <div
                  style={{
                    paddingBottom: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#66605E',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Puoi restituire il prodotto entro 14 giorni dalla ricezione.
                  </p>
                </div>
              </details>

              <details style={{ borderBottom: '1px solid #E0D7D5' }}>
                <summary
                  style={{
                    padding: '16px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    listStyle: 'none',
                  }}
                >
                  <span>Tempi di Spedizione </span>
                  <span style={{ color: '#EC719C', fontSize: '18px' }}>+</span>
                </summary>
                <div
                  style={{
                    paddingBottom: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#66605E',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Spedizione standard in 2-4 giorni lavorativi.
                  </p>
                </div>
              </details>

              <details style={{ borderBottom: '1px solid #E0D7D5' }}>
                <summary
                  style={{
                    padding: '16px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    listStyle: 'none',
                  }}
                >
                  <span>Come lavarlo </span>
                  <span style={{ color: '#EC719C', fontSize: '18px' }}>+</span>
                </summary>
                <div
                  style={{
                    paddingBottom: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#66605E',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Lavare delicatamente a mano in acqua fredda.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}