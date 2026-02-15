import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { setClientInfo } from '../Reducer/invoice/invoiceSlice.js'
import { generateInvoicePdf } from '../Reducer/invoice/invoicepdf.js'
import { useNavigate } from 'react-router-dom'

const Invoice = () => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()

  const invoice = useAppSelector((s) => s.invoice)

  const handlePdf = () => {
    generateInvoicePdf({
      invoice,
      items: invoice.selectedProductIds.selectedRows,
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight={800}>
          Facture
        </Typography>

        <Stack direction="row" gap={1}>
          <Button variant="outlined" onClick={() => nav('/products')}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handlePdf}
            disabled={invoice.selectedProductIds.length === 0}
          >
            Export PDF
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={900} align="center">
            FACTURE
          </Typography>

          <Typography align="center" sx={{ opacity: 0.7 }}>
            FACTURE N° {invoice.factureNumber} — DATE : {invoice.factureDate}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>AUPRES DE :</Typography>
              <TextField
                fullWidth
                label="Nom du destinataire"
                value={invoice.client.name}
                onChange={(e) =>
                  dispatch(setClientInfo({ name: e.target.value }))
                }
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                label="Nom de l’entreprise"
                value={invoice.client.company}
                onChange={(e) =>
                  dispatch(setClientInfo({ company: e.target.value }))
                }
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                label="Adresse"
                value={invoice.client.address}
                onChange={(e) =>
                  dispatch(setClientInfo({ address: e.target.value }))
                }
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                label="Ville"
                value={invoice.client.city}
                onChange={(e) =>
                  dispatch(setClientInfo({ city: e.target.value }))
                }
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                label="Téléphone"
                value={invoice.client.phone}
                onChange={(e) =>
                  dispatch(setClientInfo({ phone: e.target.value }))
                }
                sx={{ mt: 1 }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>Produits sélectionnés :</Typography>
              <Box sx={{ mt: 1 }}>
                {invoice.selectedProductIds.selectedRows.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      p: 1,
                      border: '1px solid #eee',
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <Typography fontWeight={700}>{p.ref}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Date: {p.dateProduction} — Planned: {p.qtyPlanned} —
                      Produced: {p.qtyProduced}
                    </Typography>
                  </Box>
                ))}
                {invoice.selectedProductIds.length === 0 && (
                  <Typography sx={{ opacity: 0.6 }}>
                    لم يتم اختيار أي منتج من جدول المنتجات.
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography align="center" fontWeight={800}>
            NOUS VOUS REMERCIONS DE VOTRE CONFIANCE.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
export default Invoice
