import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Stack,
  TextField,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DataGrid, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid'
import {
  Edit,
  Save,
  Close,
  Add,
  Delete,
  Description,
  LocalShipping,
} from '@mui/icons-material'

import { Typography } from '@mui/material'
import Inventory2Icon from '@mui/icons-material/Inventory2'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useNavigate } from 'react-router-dom'
import {
  setDocumentType,
  setSelectedProducts,
} from '../Reducer/invoice/invoiceSlice'
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from '../Reducer/products/productsSlice'

const ProductGridMUI = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const products = useAppSelector((state) => state.products.listPrd)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [rowModesModel, setRowModesModel] = useState({})
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  })
  const [search, setSearch] = useState('')

  // 🔎 Search
  const filteredRows = useMemo(() => {
    return products.filter((row) =>
      Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()),
    )
  }, [products, search])

  // ✅ UPDATE
  const processRowUpdate = (newRow) => {
    dispatch(updateProduct(newRow))
    return newRow
  }

  const handleEditClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }))
  }

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }))
  }

  const handleDeleteClick = (id) => () => {
    dispatch(deleteProduct(id))
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },

    { field: 'ref', headerName: 'Ref', flex: 1, editable: true },

    {
      field: 'dateProduction',
      headerName: 'Date Production',
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <DatePicker
          value={params.value ? dayjs(params.value) : null}
          onChange={(newValue) => {
            params.api.setEditCellValue({
              id: params.id,
              field: 'dateProduction',
              value: newValue ? newValue.format('DD.MM.YYYY') : '',
            })
          }}
          slotProps={{ textField: { size: 'small' } }}
        />
      ),
    },

    {
      field: 'qtyPlanned',
      headerName: 'Qty Planned',
      flex: 1,
      editable: true,
      type: 'number',
    },

    {
      field: 'qtyProduced',
      headerName: 'Qty Produced',
      flex: 1,
      editable: true,
      type: 'number',
    },

    {
      field: 'com',
      headerName: 'Commentaire',
      flex: 1,
      editable: true,
    },

    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['hfactory', 'sofime'],
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={handleSaveClick(id)}
              sx={{ color: 'green' }}
            />,
            <GridActionsCellItem
              icon={<Close />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              sx={{ color: 'gray' }}
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={handleEditClick(id)}
            sx={{ color: 'blue' }}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            sx={{ color: 'red' }}
          />,
        ]
      },
    },
  ]

  const handleAdd = () => {
    const id = Date.now()

    dispatch(
      addProduct({
        id,
        ref: '',
        dateProduction: '',
        qtyPlanned: 0,
        qtyProduced: 0,
        com: '',
        user: '',
      }),
    )

    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))
  }

  const handleExportFacture = () => {
    const selectedRows = products.filter((r) => rowSelectionModel.ids.has(r.id))

    if (!selectedRows.length) return alert('Select rows first')

    dispatch(setDocumentType('facture'))
    dispatch(setSelectedProducts(selectedRows))
    navigate('/invoice')
  }

  const handleExportLivraison = () => {
    const selectedRows = products.filter((r) => rowSelectionModel.ids.has(r.id))

    if (!selectedRows.length) return alert('Select rows first')

    dispatch(setDocumentType('livraison'))
    dispatch(setSelectedProducts(selectedRows))
    navigate('/invoice')
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f4f6f8' }}>
      {/* typography : title */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory2Icon sx={{ color: '#1976d2', fontSize: 35 }} />

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1976d2',
              }}
            >
              Products & Orders
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'gray',
              }}
            >
              Manage production, products and generate invoices or delivery
              notes
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* typography : title */}
      <Paper
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          backgroundColor: 'white',
        }}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          sx={{ p: 2 }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              startIcon={<Description />}
              onClick={handleExportFacture}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Generate Invoice
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocalShipping />}
              onClick={handleExportLivraison}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Delivery Note
            </Button>
          </Stack>

          <TextField
            size="small"
            label="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={(model) => setRowSelectionModel(model)}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </Paper>
    </Box>
  )
}

export default ProductGridMUI
