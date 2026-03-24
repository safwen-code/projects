const validateProduct = (row) => {
  const errors = {}

  if (!row.ref?.trim()) errors.ref = 'Ref is required'
  if (!row.dateProduction) errors.dateProduction = 'Date is required'
  if (!row.qtyPlanned || row.qtyPlanned <= 0) errors.qtyPlanned = 'Must be > 0'
  if (!row.qtyProduced || row.qtyProduced <= 0)
    errors.qtyProduced = 'Must be > 0'
  if (!row.user) errors.user = 'Client is required'

  return errors
}

export default validateProduct
