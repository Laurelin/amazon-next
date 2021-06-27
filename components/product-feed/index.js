import Product from './product';

export default function ProductFeed({ products }) {
  return (
    // something went very screwy somewhere and lg:grid-cols-3 and lg:grid-cols-1 are switched.
    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4 md:-mt-52 mx-auto">
      {products.slice(0, 4).map(({ id, title, price, description, category, image }) => (
        <Product
          key={id}
          id={id}
          title={title}
          price={price}
          description={description}
          category={category}
          image={image}
        />
      ))}
      <img
        className="md:col-span-4"
        src="https://i.ibb.co/5LBBKYk/discover.jpg"
        alt="Discover products from small and medium businesses"
      />

      <div className="md:col-span-2">
        {products.slice(4, 5).map(({ id, title, price, description, category, image }) => (
          <Product
            key={id}
            id={id}
            title={title}
            price={price}
            description={description}
            category={category}
            image={image}
          />
        ))}
      </div>
      {products
        .slice(5, products.length)
        .map(({ id, title, price, description, category, image }) => (
          <Product
            key={id}
            id={id}
            title={title}
            price={price}
            description={description}
            category={category}
            image={image}
          />
        ))}
    </div>
  );
}
