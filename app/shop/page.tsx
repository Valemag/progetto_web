import { getProducts } from '@/app/actions/productActions';
import Link from 'next/link'; // <--- Mancava questa importazione!
import './shop.css';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="shop-container">
      {/* HEADER IN CIMA ALLA PAGINA */}
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
          <Link href="/login" aria-label="login ">👤</Link>
        </nav>
      </header>
    
      {/* INTESTAZIONE SPECIFICA DELLA PAGINA */}
      <div className="shop-header">
        <h1 className="shop-title">Borse </h1>
        <p className="shop-description">
          Ogni pezzo è unico, realizzato interamente a mano all'uncinetto con filati di alta qualità.
        </p>
      </div>

      {/* GESTIONE STATO VUOTO / GRIGLIA PRODOTTI */}
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#78716c', padding: '3rem 0' }}>
          Nessun prodotto disponibile al momento. Torna a trovarci presto!
        </p>
      ) : (
        <div className="shop-grid">
          {products.map((product) => (
            <div key={product.id} className="shop-card">
              <div className="shop-img-wrapper">
                <img
                  src={product.imageUrl || '/placeholder.jpg'}
                  alt={product.name}
                  className="shop-card-img"
                />
              </div>

              <div className="shop-card-info">
                <h3 className="shop-card-title">{product.name}</h3>

                <div className="shop-price-box">
                  <span className="price-discount">€{product.price}</span>
                 
                </div>
                <Link href={`/shop/${product.id}`} className="shop-card-link">
                  <button className="btn-negozio">vedi dettagli </button>
                </Link>
               
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}