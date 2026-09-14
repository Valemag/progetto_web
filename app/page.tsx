import Link from 'next/link';
import './homepage.css';

export default function HomePage() {
  return (
    <main className="home-container">
      {/* HEADER CON LOGO */}
   <header className="site-header">
  <div className="logo-container">
    <Link href="/">
      {/* Metti il file del tuo logo dentro la cartella /public */}
      <img src="/foto/logo_trasparente.png" 
      width={200}  /* Aumenta la larghezza (es. da 120 a 200) */
      height={100} /* Aumenta l'altezza (es. da 60 a 100) */ alt="Logo" className="logo-img" />
    </Link>
  </div>
  <nav className="nav-menu">
    <Link href="/shop">Shop</Link>
    <Link href="/admin" aria-label="Pannello Admin">👤</Link>
  </nav>
</header>

      {/* HERO SECTION */}
      <section className="hero-section">
  {/* CAROSELLO DI SFONDO */}
  <div className="hero-slider">
    <div className="hero-slider-track">
      <img src="/foto/photo_2026-09-14_19-14-26.jpg" alt="Borsa artigianale 1" />
      <img src="/foto/photo_2026-09-14_19-15-10.jpg" alt="Borsa artigianale 2" />
      <img src="/foto/photo_2026-09-14_19-15-13.jpg" alt="Borsa artigianale 3" />
      {/* Duplica le immagini per creare l'effetto infinito senza interruzioni */}
      <img  src="/foto/photo_2026-09-14_19-14-26.jpg" alt="Borsa artigianale 1" />
      <img src="/foto/photo_2026-09-14_19-15-10.jpg" alt="Borsa artigianale 2" />
      <img src="/foto/photo_2026-09-14_19-15-13.jpg" alt="Borsa artigianale 3" />
    </div>
  </div>

  {/* STRATO SCURO OVERLAY (rende il testo leggibile sulle foto) */}
  <div className="hero-overlay"></div>

  {/* CONTENUTO TESTUALE */}
  <div className="hero-content">
    <span className="hero-subtitle">Creazioni Uniche all'Uncinetto</span>
    <h1 className="hero-title">Borse Artigianali Fatte a Mano</h1>
    <p className="hero-description">
      Ogni borsa è un pezzo unico, realizzato con cura e passione.
    </p>
    <div className="hero-buttons">
      <Link href="/shop" className="btn btn-primary">Esplora la Collezione</Link>
      <Link href="/admin" className="btn btn-secondary">Pannello Admin</Link>
    </div>
  </div>
</section>

      {/* CAROSELLO IMMAGINI (SCROLL SLIDER) */}
      <section className="slider-section">
        <h2 className="section-title">In Vetrina</h2>
        <div className="slider-container">
          <div className="slider-track">
            <div className="slider-item">
              <img src="https://picsum.photos/600/400?random=1" alt="Borsa in lavorazione" />
            </div>
            <div className="slider-item">
              <img src="https://picsum.photos/600/400?random=2" alt="Dettaglio uncinetto" />
            </div>
            <div className="slider-item">
              <img src="https://picsum.photos/600/400?random=3" alt="Borsa finita" />
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDE PRODOTTI */}
      <section className="products-section">
        <h2 className="section-title">I Nostri Pezzi Unici</h2>
        <div className="products-grid">
          
          <div className="product-card">
            <img src="https://picsum.photos/400/400?random=4" alt="Borsa Ambra" className="product-img" />
            <div className="product-info">
              <h3 className="product-name">Borsa Ambra</h3>
              <p className="product-price">€ 45,00</p>
              <Link href="/shop" className="btn btn-card">Vedi Dettagli</Link>
            </div>
          </div>

          <div className="product-card">
            <img src="https://picsum.photos/400/400?random=5" alt="Borsa Perla" className="product-img" />
            <div className="product-info">
              <h3 className="product-name">Borsa Perla</h3>
              <p className="product-price">€ 55,00</p>
              <Link href="/shop" className="btn btn-card">Vedi Dettagli</Link>
            </div>
          </div>

          <div className="product-card">
            <img src="https://picsum.photos/400/400?random=6" alt="Borsa Smeraldo" className="product-img" />
            <div className="product-info">
              <h3 className="product-name">Borsa Smeraldo</h3>
              <p className="product-price">€ 60,00</p>
              <Link href="/shop" className="btn btn-card">Vedi Dettagli</Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}