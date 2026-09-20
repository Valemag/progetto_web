import { getCartItems } from './actions';
import CartClient from './CartClient';

export default async function CartPage() {
  const initialItems = await getCartItems();

  return (
    <main>
      <CartClient initialItems={initialItems} />
    </main>
  );
}