import { Provider } from 'react-redux';
import { store } from '../slices/basket-slice';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
