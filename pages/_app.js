import { Provider } from 'react-redux';
import { store } from '../app/store';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>;
}
