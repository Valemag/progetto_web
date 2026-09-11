import { getProducts, createProduct, deleteProduct } from '@/app/actions/productActions.ts';

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <main className="max-w-5xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-neutral-800 text-center">
        Pannello Admin - Gestione Borse
      </h1>

      {/* FORM DI INSERIMENTO PRODOTTO */}
      <section className="bg-stone-50 border border-stone-200 p-6 rounded-lg mb-10 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-stone-700">Aggiungi Nuova Borsa</h2>
        <form action={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-stone-600">Nome Prodotto</label>
            <input
              type="text"
              name="name"
              required
              placeholder="es. Borsa Crochet Luna"
              className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium mb-1 text-stone-600">Prezzo (€)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              placeholder="45.00"
              className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-stone-600">Quantità / Stock</label>
            <input
              type="number"
              name="stock"
              defaultValue="1"
              required
              className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-stone-600">URL Immagine</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-stone-600">Descrizione</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Descrivi la borsa fatta a mano..."
              className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            ></textarea>
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-stone-800 text-white py-2.5 rounded font-medium hover:bg-stone-700 transition-colors"
          >
            Salva Prodotto nel Database
          </button>
        </form>
      </section>

      {/* LISTA PRODOTTI NEL DATABASE */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-stone-700">Prodotti nel Catalogo ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-stone-500 italic">Nessuna borsa presente nel database. Aggiungine una usando il form in alto.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-stone-200 rounded p-4 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg text-stone-800">{product.name}</h3>
                  <p className="text-sm text-stone-500">€{Number(product.price).toFixed(2)} | Stock: {product.stock}</p>
                </div>
                <form action={deleteProduct.bind(null, product.id)}>
                  <button
                    type="submit"
                    className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded text-sm hover:bg-red-100 transition-colors"
                  >
                    Elimina
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}