

import { getProducts, createProduct, updateProduct, deleteProduct } from '@/app/actions/productActions';
import './admin.css'; // Importa il file CSS
import Link from 'next/link';
import BackHomeButton from '@/app/components/BackHomeButton';
import AdminLogoutButton from '../components/AdminLogoutButton';

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <main className="admin-container">
      <h1 className="admin-title">
        Pannello Admin - Gestione Borse
      </h1>
<Link href="/orders" aria-label="ordini  "></Link>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
  <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#262626', margin: 0 }}>
    Pannello Admin 📦
  </h1>
  <AdminLogoutButton />
</div>

      {/* FORM DI INSERIMENTO NUOVO PRODOTTO */}
      <section className="card form-section">
        <h2 className="section-title">Aggiungi Nuova Borsa</h2>
        
        <form action={createProduct} className="form-grid">
          <div className="form-group">
            <label className="form-label">Nome Prodotto</label>
            <input
              type="text"
              name="name"
              required
              placeholder="es. Borsa Crochet Luna"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prezzo (€)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              placeholder="45.00"
              className="form-input"
            />
          </div>

         
         

          <div className="form-group">
            <label className="form-label">Carica Foto dal PC</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              required
              className="form-file-input"
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Descrizione</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Descrivi la borsa fatta a mano..."
              className="form-input"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary full-width">
            Salva Prodotto nel Database
          </button>
        </form>
      </section>

    <div style={{ margin: '16px 0' }}>
      <Link 
        href="/admin/orders" 
        style={{
          display: 'inline-block',
          backgroundColor: '#EC719C',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(236, 113, 156, 0.2)',
          transition: 'background-color 0.2s ease',
        }}
      >
        📦 Visualizza Ordini da Preparare
      </Link>
    </div>

      {/* LISTA E MODIFICA PRODOTTI */}
      <section>
        <h2 className="section-title">Prodotti nel Catalogo ({products.length})</h2>
        {products.length === 0 ? (
          <p className="empty-message">Nessuna borsa presente nel database. Aggiungine una usando il form in alto.</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="card product-card">
                
                {/* FORM MODIFICA */}
                <form 
                  action={updateProduct.bind(null, product.id)} 
                  className="product-edit-form"
                >
                  <input type="hidden" name="currentImageUrl" value={product.imageUrl} />

                  <div className="edit-grid">
                    <div className="edit-grid-large">
                      <label className="form-label-sm">Nome Prodotto</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={product.name}
                        required
                        className="form-input text-sm"
                      />
                    </div>

                    <div>
                      <label className="form-label-sm">Prezzo (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        defaultValue={product.price}
                        required
                        className="form-input text-sm"
                      />
                    </div>

                   
                  </div>

                  <div>
                    <label className="form-label-sm">Descrizione</label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={product.description}
                      required
                      className="form-input text-sm"
                    ></textarea>
                  </div>

                  <div className="product-footer">
                    <div className="image-field-group">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="product-thumbnail" 
                        />
                      )}
                      <div>
                        <label className="form-label-sm">Sostituisci Immagine (opzionale)</label>
                        <input
                          type="file"
                          name="imageFile"
                          accept="image/*"
                          className="file-input-sm"
                        />
                      </div>
                    </div>

                    <div className="actions-group">
                      <button type="submit" className="btn btn-amber">
                        Aggiorna Prodotto
                      </button>
                    </div>
                  </div>
                </form>

                {/* FORM SEPARATO PER ELIMINARE */}
                <div className="delete-wrapper">
                  <form action={deleteProduct.bind(null, product.id)}>
                    <button type="submit" className="btn btn-danger">
                      Elimina
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}