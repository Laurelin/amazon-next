import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Currency from 'react-currency-formatter';
import { useSession } from 'next-auth/client';
import Header from '../components/header';
import { selectItems, selectTotal } from '../slices/basket-slice';
import CheckoutProduct from '../components/checkoutProduct';

export default function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const [session] = useSession();

  useEffect(() => {
    document.title = 'Amazon-checkout';
  }, [items]);

  return (
    <div>
      <Header />
      <main className="lg:max-w-screen-xl lg:flex mx-auto">
        {/* {left hand} */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://i.ibb.co/fHgnVVr/Prime-day-banner.png"
            width={1020}
            height={250}
            objectFit="contain"
            alt="Prime Day Banner"
          />

          <div className="flex flex-col space-y-10 p-5 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0 ? 'Your Amazon Basket is empty' : 'Shopping Basket'}
            </h1>
            {items.map((item, i) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                rating={item.rating}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col bg-white shadow-md mt-6 p-10">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):
                <span className="font-bold">
                  <Currency quantity={total} />
                </span>
              </h2>

              <button
                disabled={!session}
                type="button"
                className={`button mt-2 ${
                  !session &&
                  'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                {!session ? 'Sign In to checkout' : 'Proceed to checkout'}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}