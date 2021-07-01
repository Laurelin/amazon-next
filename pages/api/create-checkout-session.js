const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function getProductsOrdered(itemIds, tries) {
  try {
    const promisesArr = itemIds.map((itemId) =>
      fetch(`https://fakestoreapi.com/products/${itemId}`)
    );
    const responses = await Promise.all(promisesArr);

    const jsonPromisesArr = responses.map((res) => res.json());
    const products = await Promise.all(jsonPromisesArr);
    return products;
  } catch (error) {
    console.error(error);
    if (tries > 5) {
      // timeout
      console.error('Timeout, need to have a UI way to handle a timeout');
    } else if (tries >= 0) {
      setTimeout(getProductsOrdered(itemIds, tries + 1), 500);
    }
  }
}

export default async function handler(req, res) {
  const { items, email } = req.body;
  const nextDayShipping = 'shr_1J75zhK448tqptE5PjSRZ2ry';
  const primeShipping = 'shr_1J761PK448tqptE5aKkPVu3Z';

  const itemIds = items.map((item) => item.id);
  const orderedProducts = await getProductsOrdered(itemIds);

  const transformedItems = orderedProducts.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image]
      }
    }
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_rates: [nextDayShipping],
    shipping_address_collection: {
      allowed_countries: ['GB', 'US', 'CA', 'AU']
    },
    line_items: transformedItems,
    mode: 'payment',
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.image))
    }
  });

  res.status(200).json({ id: session.id });
}
