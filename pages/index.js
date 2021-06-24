import Head from 'next/head';
import Banner from '../components/banner';
import Header from '../components/header';
import ProductFeed from '../components/product-feed/index';

export async function getServerSideProps(context) {
  const products = await fetch('https://fakestoreapi.com/products').then((res) => res.json());

  return {
    props: {
      products
    }
  };
}

export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Next Amazon</title>
      </Head>
      <Header />
      <main className="max-w-screen-xl mx-auto">
        <Banner />
        <ProductFeed products={products} />
      </main>
    </div>
  );
}
