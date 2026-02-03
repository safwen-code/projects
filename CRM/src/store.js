import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Reducer/auth/authSlice'
import productsReducer from './Reducer/products/productsSlice'
import invoiceReducer from './Reducer/invoice/invoiceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    invoice: invoiceReducer,
  },
})
