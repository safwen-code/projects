import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  typeDocument: 'facture',
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
    name: 'Sofima',
    company: 'Sofima Filter',
    address: 'bir el Kasaa',
    city: '2059, ben arous',
    phone: '71 380 983',
  },
}

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setDocumentType: (state, action) => {
      state.typeDocument = action.payload
    },
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
  setDocumentType,
  setSelectedProducts,
  setClientInfo,
  setFactureMeta,
} = invoiceSlice.actions
export default invoiceSlice.reducer
