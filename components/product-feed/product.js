import { StarIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { useState } from 'react';
import Currency from 'react-currency-formatter';
import { useDispatch } from 'react-redux';
import { addToBasket } from '../../slices/basket-slice';

const MAX_RATING = 5;
const MIN_RATING = 1;

export default function Product({ id, title, price, description, category, image }) {
  const [rating] = useState(Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING);
  const [hasPrime] = useState(Math.random() < 0.5);
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    const product = { id, title, rating, price, description, category, image, hasPrime };

    dispatch(addToBasket(product));
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">{category}</p>
      <Image src={image} width={200} height={200} objectFit="contain" alt={description} />
      <h4 className="my-4">{title}</h4>
      <div className="flex">
        {Array(rating)
          .fill()
          .map((_, i) => (
            <StarIcon key={i} className="h-5 text-yellow-500" />
          ))}
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">
        <Currency quantity={price} />
      </div>
      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <img className="w-12" src="https://i.ibb.co/VS41td7/Prime.png" alt="Prime Logo" />
          <p className="text-xs text-gray-500">FREE Next Day Delivery</p>
        </div>
      )}
      <button onClick={addItemToBasket} type="button" className="mt-5 button">
        Add to Basket
      </button>
    </div>
  );
}
