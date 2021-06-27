import Image from 'next/image';
import { MenuIcon, SearchIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectItems } from '../slices/basket-slice';

export default function Header() {
  const [session] = useSession();
  const router = useRouter();
  const items = useSelector(selectItems);

  return (
    <header>
      <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
        {/* logo, redirects to home page */}
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push('/')}
            src="https://i.ibb.co/cgK4PTm/amazon-PNG11.png"
            width={150}
            height={40}
            objectFit="contain"
            className="cursor-pointer"
            aria-label="Amazon logo"
          />
        </div>
        {/* search bar */}
        <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
          <input
            type="text"
            className="p-2 h-full w-6 flex-grow rounded-l-md flex-shrink focus:outline-none px-4"
          />
          <SearchIcon className="h-12 p-4" />
        </div>
        {/* right side of search bar */}
        <div className="text-white items-center flex text-xs space-x-6 mx-6 whitespace-nowrap">
          <div className="hidden md:flex">
            <img
              src="https://i.ibb.co/njTySdS/united-states-of-america-flag-icon-32.png"
              alt="American flag"
            />
            <ChevronDownIcon className="ml-1 w-4 text-gray-400" />
          </div>
          <div>
            <button type="button" onClick={!session ? signIn : signOut} className=" link">
              <p className="text-left">{session ? `Hello, ${session.user.name}` : 'Sign In'}</p>
              <div className="flex">
                <p className="font-bold md:text-sm">Account & Lists</p>
                <ChevronDownIcon className="ml-1 w-4 text-gray-400" />
              </div>
            </button>
          </div>
          <div className=" link">
            <p>Returns</p>
            <p className="font-bold md:text-sm">& Orders</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/checkout')}
            className="link relative flex items-center"
          >
            <span className="absolute top-0 right-0 md:right-7 h-4 w-4 bg-yellow-400 rounded-full text-center text-black font-bold">
              {items.length}
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden font-bold md:text-sm md:inline">Cart</p>
          </button>
        </div>
      </div>
      <div className="flex items-center bg-amazon_blue-light text-white text-sm space-x-3 p-2 pl-6">
        <p className="link flex items-center">
          <MenuIcon className="h-6 mr-1" />
          All
        </p>
        <p className="link">Prime Video</p>
        <p className="link">Amazon Business</p>
        <p className="link">Today's Deals</p>
        <p className="link hidden lg:inline-flex">Electronics</p>
        <p className="link hidden lg:inline-flex">Food & Grocery</p>
        <p className="link hidden lg:inline-flex">Prime</p>
        <p className="link hidden lg:inline-flex">Buy Again</p>
        <p className="link hidden lg:inline-flex">Shopper Toolkit</p>
        <p className="link hidden lg:inline-flex">Health & Personal Care</p>
      </div>
    </header>
  );
}
