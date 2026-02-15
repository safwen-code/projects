import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Stack,
  TextField,
  Paper,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
} from '@mui/material'
import { DataGrid, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid'
import {
  Add,
  Delete,
  Edit,
  Save,
  Close,
  PictureAsPdf,
} from '@mui/icons-material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-redux'

import { setSelectedProducts } from '../Reducer/invoice/invoiceSlice'

const ProductGridMUI = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const products = useAppSelector((state) => state.products.listPrd)

  // const dispatch = useDispatch()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [rows, setRows] = useState(products)
  const [rowModesModel, setRowModesModel] = useState({})
  const [search, setSearch] = useState('')
  const [docType, setDocType] = useState('')
  const [selectedIds, setSelectedIds] = useState({
    type: 'include',
    ids: new Set(),
  })

  const [openDialog, setOpenDialog] = useState(false)
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info',
  })

  // 🔎 Search
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()),
    )
  }, [rows, search])

  const selectedRows = rows.filter((r) => selectedIds.ids.has(r.id))

  // ✅ Update row
  const processRowUpdate = (newRow) => {
    setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)))
    return newRow
  }

  // Actions
  const handleEditClick = (id) => () =>
    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }))

  const handleSaveClick = (id) => () =>
    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }))

  const handleCancelClick = (id) => () =>
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }))

  const handleDeleteClick = (id) => () =>
    setRows((prev) => prev.filter((row) => row.id !== id))

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'ref', headerName: 'Ref', flex: 1, editable: true },
    { field: 'dateProduction', headerName: 'Date', flex: 1, editable: true },
    {
      field: 'qtyPlanned',
      headerName: 'Planned',
      flex: 1,
      editable: true,
      type: 'number',
    },
    {
      field: 'qtyProduced',
      headerName: 'Produced',
      flex: 1,
      editable: true,
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: ({ id }) => {
        const isEdit = rowModesModel[id]?.mode === GridRowModes.Edit
        return isEdit
          ? [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{ color: 'green' }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<Close />}
                label="Cancel"
                sx={{ color: 'gray' }}
                onClick={handleCancelClick(id)}
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                sx={{ color: 'blue' }}
                onClick={handleEditClick(id)}
              />,
              <GridActionsCellItem
                icon={<Delete />}
                label="Delete"
                sx={{ color: 'red' }}
                onClick={handleDeleteClick(id)}
              />,
            ]
      },
    },
  ]

  const handleAdd = () => {
    const id = Date.now()
    setRows((prev) => [
      { id, client: '', product: '', qty: 0, price: 0 },
      ...prev,
    ])
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))

    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }))
  }

  const handleExportClick = () => {
    if (!docType) {
      setSnack({
        open: true,
        message: 'choose type of file  ',
        severity: 'warning',
      })
      return
    }

    if (!selectedRows.length) {
      setSnack({
        open: true,
        message: 'choose element 1',
        severity: 'warning',
      })
      return
    }

    const doc = new jsPDF()
    doc.text('Client Report', 14, 15)

    autoTable(doc, {
      startY: 20,
      head: [['Client', 'Product', 'Qty', 'Price']],
      body: selectedRows.map((r) => [r.client, r.product, r.qty, r.price]),
    })

    doc.save('report.pdf')
    setOpenDialog(true)
  }

  const confirmExport = () => {
    dispatch(setSelectedProducts({ selectedRows }))
    navigate('/invoice')
  }

  return (
    <Box sx={{ height: '100vh', p: 3, bgcolor: '#f4f6f8' }}>
      <Paper
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
        }}
      >
        {/* Toolbar */}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
              Ajouter
            </Button>

            <ToggleButtonGroup
              value={docType}
              exclusive
              onChange={(e, value) => setDocType(value)}
              size="small"
            >
              <ToggleButton value="invoice">Facture</ToggleButton>
              <ToggleButton value="delivery">Bon livraison</ToggleButton>
            </ToggleButtonGroup>

            {selectedIds.length > 0 && (
              <Chip
                label={`${selectedIds.length} sélectionné(s)`}
                color="primary"
              />
            )}

            <Button
              variant="contained"
              color="error"
              startIcon={<PictureAsPdf />}
              disabled={!docType}
              onClick={handleExportClick}
            >
              Export PDF
            </Button>
          </Stack>

          <TextField
            size="small"
            label="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
        </Stack>

        {/* DataGrid */}
        <Box sx={{ flex: 1 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            processRowUpdate={processRowUpdate}
            rowSelectionModel={selectedIds}
            onRowSelectionModelChange={(model) => setSelectedIds(model)}
            pageSizeOptions={[5, 10, 20]}
          />
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>تأكيد التصدير</DialogTitle>
        <DialogContent>
          <Typography>
            هل تريد تصدير {selectedRows.length} عنصر كـ{' '}
            {docType === 'invoice' ? 'Facture' : 'Bon de livraison'}؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button variant="contained" onClick={confirmExport}>
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ProductGridMUI
