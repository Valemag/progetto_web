import { getCheckoutItems } from './actions';
import CheckoutClient from './CheckoutClient';
import { cookies } from 'next/headers';

export default async function CheckoutPage() {
  const items = await getCheckoutItems();
  
  const cookieStore = cookies();
  const session = (await cookieStore).get('session');
  const user = session ? JSON.parse(session.value) : { email: '' };

  return (
    <main>
      <CheckoutClient initialItems={items} userEmail={user.email} />
    </main>
  );
}