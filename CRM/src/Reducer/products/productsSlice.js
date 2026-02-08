import { createSlice, nanoid } from '@reduxjs/toolkit'
import { fakeProducts } from '../../util/fakeProducts'

const initialState = {
  list: fakeProducts,
  listPrd: fakeProducts,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: {
      reducer: (state, action) => {
        state.list.unshift(action.payload)
      },
      prepare: (data) => ({
        payload: {
          id: nanoid(),
          ref: data.ref ?? '',
          dateProduction: data.dateProduction ?? '',
          qtyPlanned: Number(data.qtyPlanned ?? 0),
          qtyProduced: Number(data.qtyProduced ?? 0),
          com: data.com ?? '',
        },
      }),
    },

    updateProduct: (state, action) => {
      const { id, changes } = action.payload
      const idx = state.list.findIndex((p) => p.id === id)
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...changes }
      }
    },

    deleteProduct: (state, action) => {
      const id = action.payload
      state.list = state.list.filter((p) => p.id !== id)
    },
  },
})

export const {
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions

export default productsSlice.reducer
