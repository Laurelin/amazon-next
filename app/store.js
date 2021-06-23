import { configureStore } from '@reduxjs/toolkit';
import basketReducer from '../slices/basket-slice';

export const store = configureStore({
  reducer: {
    basket: basketReducer
  }
});
