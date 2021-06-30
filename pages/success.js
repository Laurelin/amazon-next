import { CheckCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Header from '../components/header';

export default function Success() {
  const router = useRouter();
  return (
    <div>
      <Header />
      <main className="max-w-screen-xl mx-auto">
        <div className="bg-white p-10">
          <div className="flex space-x-2 mb-5">
            <CheckCircleIcon className="text-green-500 h-10" />
            <h1 className="text-3xl font-semibold">Thank you, your ordered has been confirmed!</h1>
          </div>
          <p>
            Thank you for shopping with us. We'll send confirmation once your order has shipped. If
            you would like to check the status of your order(s) please press the link below.
          </p>
          <button
            onClick={() => router.push('/orders')}
            type="button"
            className="button w-full font-semibold mt-8"
          >
            Go to my orders
          </button>
        </div>
      </main>
    </div>
  );
}
