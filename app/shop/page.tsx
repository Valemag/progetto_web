import { getProducts } from '../actions/productActions';
import Image from 'next/image';
import Link from 'next/link';
import './shop.css';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-amber-950 tracking-wide mb-3">
          Collezione Borse Fatte a Mano
        </h1>
        <p className="text-stone-600 max-w-md mx-auto text-sm">
          Ogni pezzo è unico, realizzato interamente a mano all'uncinetto con filati di alta qualità.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-stone-500 py-12 font-light">
          Nessun prodotto disponibile al momento. Torna a trovarci presto!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={product.image_url || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-stone-500 text-xs mt-1 line-clamp-2">
                    {product.description || 'Nessuna descrizione disponibile.'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="font-semibold text-stone-900">
                    €{Number(product.price).toFixed(2)}
                  </span>
                  <button className="bg-amber-900/90 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-amber-950 transition-colors">
                    Aggiungi al Carrello
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}