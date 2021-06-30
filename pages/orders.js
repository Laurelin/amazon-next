import moment from 'moment';
import { getSession, useSession } from 'next-auth/client';
import Header from '../components/header';
import db from '../lib/firebase';
import Order from '../components/order';

export default function Orders({ orders }) {
  const [session] = useSession();
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto p-10 bg-white">
        <h1 className="text-3xl border-b border-yellow-400 mb-2 pb-1">Your Orders</h1>
        {session ? <h2>{orders.length} Orders</h2> : <h2>Please sign in to see your orders</h2>}
        <div className="mt-5 space-y-4">
          {orders?.map(({ id, amount, amountShipping, items, timestamp, images }) => (
            <Order
              key={id}
              id={id}
              amount={amount}
              amountShipping={amountShipping}
              items={items}
              timestamp={timestamp}
              images={images}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // eslint-disable-next-line global-require
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const session = await getSession(context);

  if (!session) {
    return {
      props: {}
    };
  }

  const stripeOrders = await db
    .collection('users')
    .doc(session.user.email)
    .collection('orders')
    .orderBy('timestamp', 'desc')
    .get();

  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100
        })
      ).data
    }))
  );

  return {
    props: {
      orders,
      session
    }
  };
}
