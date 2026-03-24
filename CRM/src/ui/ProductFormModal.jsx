import { useState, useEffect } from 'react'
import { TextField, Button, MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import dayjs from 'dayjs'
import validateProduct from '../util/validateProduct'

const ProductFormModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({
      id: initialData?.id || Date.now(),
      ref: initialData?.ref || '',
      dateProduction: initialData?.dateProduction || null,
      qtyPlanned: initialData?.qtyPlanned || 0,
      qtyProduced: initialData?.qtyProduced || 0,
      com: initialData?.com || '',
      user: initialData?.user || '',
    })
    setErrors({})
  }, [initialData])

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    setErrors(validateProduct(updated))
  }

  const handleSubmit = () => {
    const validationErrors = validateProduct(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onSave(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Product</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Ref"
          value={form.ref || ''}
          onChange={(e) => handleChange('ref', e.target.value)}
          error={!!errors.ref}
          helperText={errors.ref}
        />

        {/* ✅ DATE FIX */}
        <DatePicker
          label="Date"
          value={form.dateProduction ? dayjs(form.dateProduction) : null}
          onChange={(d) =>
            handleChange(
              'dateProduction',
              d ? d.toISOString() : null, // خزن كـ ISO string
            )
          }
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.dateProduction,
              helperText: errors.dateProduction,
            },
          }}
        />

        <TextField
          type="number"
          label="Qty Planned"
          value={form.qtyPlanned || 0}
          onChange={(e) => handleChange('qtyPlanned', +e.target.value)}
          error={!!errors.qtyPlanned}
          helperText={errors.qtyPlanned}
        />

        <TextField
          type="number"
          label="Qty Produced"
          value={form.qtyProduced || 0}
          onChange={(e) => handleChange('qtyProduced', +e.target.value)}
          error={!!errors.qtyProduced}
          helperText={errors.qtyProduced}
        />

        {/* ✅ CLIENT SELECT */}
        <TextField
          select
          label="Client"
          value={form.user || ''}
          onChange={(e) => handleChange('user', e.target.value)}
          error={!!errors.user}
          helperText={errors.user}
        >
          <MenuItem value="hfactory">hfactory</MenuItem>
          <MenuItem value="sofime">sofime</MenuItem>
        </TextField>

        <TextField
          label="Comment"
          value={form.com || ''}
          onChange={(e) => handleChange('com', e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductFormModal
