import { createSlice } from '@reduxjs/toolkit'
import { fakeProducts } from '../../util/fakeProducts'

const initialState = {
  listPrd: fakeProducts,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: {
      reducer: (state, action) => {
        state.listPrd.unshift(action.payload)
      },
      prepare: (data) => ({
        payload: {
          id: data.id,
          ref: data.ref ?? '',
          dateProduction: data.dateProduction ?? '',
          qtyPlanned: Number(data.qtyPlanned ?? 0),
          qtyProduced: Number(data.qtyProduced ?? 0),
          com: data.com ?? '',
        },
      }),
    },

    updateProduct: (state, action) => {
      const { id, ...changes } = action.payload
      const existingProduct = state.listPrd.find((p) => p.id === id)
      if (existingProduct) {
        Object.assign(existingProduct, changes)
      }
    },

    deleteProduct: (state, action) => {
      const id = action.payload
      state.listPrd = state.listPrd.filter((p) => p.id !== id)
    },
  },
})

export const {
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions

export default productsSlice.reducer
