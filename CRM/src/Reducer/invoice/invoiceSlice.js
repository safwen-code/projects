import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedProductIds: [],
  factureNumber: 100,
  factureDate: new Date().toISOString().slice(0, 10),
  seller: {
    companyName: 'Nom de la société',
    slogan: 'Slogan de votre société',
    address: 'Adresse postale',
    city: 'Code postal, ville',
    phone: 'Téléphone',
  },
  client: {
    name: 'Nom du destinataire',
    company: 'Nom de l’entreprise',
    address: 'Adresse postale',
    city: 'Code postal, Ville',
    phone: 'Téléphone',
  },
}

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setSelectedProducts: (state, action) => {
      state.selectedProductIds = action.payload
    },
    setClientInfo: (state, action) => {
      state.client = { ...state.client, ...action.payload }
    },
    setFactureMeta: (state, action) => {
      state.factureNumber = action.payload.factureNumber ?? state.factureNumber
      state.factureDate = action.payload.factureDate ?? state.factureDate
    },
  },
})

export const {
  setSelectedProducts,
  setClientInfo,
  setFactureMeta,
} = invoiceSlice.actions
export default invoiceSlice.reducer
