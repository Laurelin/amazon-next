import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Banner from '../components/banner';
import Header from '../components/header';
import ProductFeed from '../components/product-feed/index';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const products = await fetch('https://fakestoreapi.com/products').then((res) => res.json());

  return {
    props: {
      products,
      session
    }
  };
}

export default function Home({ products }) {
  return (
    <div>
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
