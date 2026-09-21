import Link from 'next/link';
import { cookies } from 'next/headers';
import { getProducts } from '@/app/actions/productActions';
import './homepage.css';

export default async function HomePage() {
  // Recupera la sessione dall'oggetto cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  let user: { id: number; name: string; email: string; role: string } | null = null;
  if (sessionCookie?.value) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch {
      user = null;
    }
  }

  // Recupera i prodotti dal DB
  const products = await getProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="home-container">
      {/* HEADER CON LOGO */}
      <header className="site-header">
        <div className="logo-container">
          <Link href="/">
            <img 
              src="/foto/logo_trasparente.png" 
              width={200} 
              height={100} 
              alt="Logo" 
              className="logo-img" 
            />
          </Link>
        </div>
        <nav className="nav-menu">
          <Link href="/shop">Shop</Link>
          
          {/* Se l'utente è loggato mostra il nome ed il link al profilo, altrimenti l'icona login */}
          {user && user.role!== 'admin' && (
            <Link href="/cart" aria-label="carrello">🛒</Link>
          )}
          {user ? (
            <Link href={user.role === 'admin' ? '/admin' : '/profile'} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              👤 <span>{user.name}</span>
            </Link>
          ) : (
            <Link href="/login" aria-label="Accedi">👤</Link>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-slider">
          <div className="hero-slider-track">
            <img src="/foto/photo_2026-09-14_19-14-26.jpg" alt="Borsa artigianale 1" />
            <img src="/foto/photo_2026-09-14_19-15-10.jpg" alt="Borsa artigianale 2" />
            <img src="/foto/photo_2026-09-14_19-15-13.jpg" alt="Borsa artigianale 3" />
            <img src="/foto/photo_2026-09-14_19-14-26.jpg" alt="Borsa artigianale 1" />
            <img src="/foto/photo_2026-09-14_19-15-10.jpg" alt="Borsa artigianale 2" />
            <img src="/foto/photo_2026-09-14_19-15-13.jpg" alt="Borsa artigianale 3" />
          </div>
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-subtitle">Creazioni Uniche all'Uncinetto</span>
          <h1 className="hero-title">Borse Artigianali Fatte a Mano</h1>
          <p className="hero-description">
            Ogni borsa è un pezzo unico, realizzato con cura e passione.
          </p>
          <div className="hero-buttons">
            <Link href="/shop" className="btn btn-secondary">Esplora la Collezione</Link>
          </div>
        </div>
      </section>

      {/* SCHEDE PRODOTTI DINAMICHE */}
      <section className="products-section">
        <h2 className="section-title">Prodotti in evidenza</h2>
        
        {featuredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#78716c', padding: '2rem 0' }}>
            Nessun prodotto in evidenza al momento.
          </p>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img 
                  src={product.imageUrl || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="product-img" 
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">€ {Number(product.price).toFixed(2)}</p>
                  
                  <Link href={`/shop/${product.id}`} className="btn btn-card">
                    Vedi Dettagli
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}