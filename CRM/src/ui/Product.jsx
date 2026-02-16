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

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useNavigate } from 'react-router-dom'
import {
  setDocumentType,
  setSelectedProducts,
} from '../Reducer/invoice/invoiceSlice'
import {
  addProduct,
  // updateProduct,
  // deleteProduct,
} from '../Reducer/products/productsSlice'
const ProductGridMUI = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const products = useAppSelector((state) => state.products.listPrd)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // const [rows, setRows] = useState(products)

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

  // ✅ Update row
  const processRowUpdate = (newRow) => {
    // setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)))
    console.log('update')
    return newRow
  }

  // 🔵 Edit
  const handleEditClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))
  }

  // 💾 Save
  const handleSaveClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }))
  }

  // ❌ Cancel
  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }))
  }

  // 🔴 Delete
  const handleDeleteClick = (id) => () => {
    // setRows((prev) => prev.filter((row) => row.id !== id))
    console.log('delete', id)
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'ref', headerName: 'Ref', flex: 1, editable: true },
    {
      field: 'dateProduction',
      headerName: 'dateProduction',
      flex: 1,
      editable: true,
    },
    {
      field: 'qtyPlanned',
      headerName: 'qtyPlanned',
      flex: 1,
      editable: true,
      type: 'number',
    },
    {
      field: 'qtyProduced',
      headerName: 'qtyProduced',
      flex: 1,
      editable: true,
      type: 'number',
    },
    { field: 'com', headerName: 'Commentaire', flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
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
    const newProduct = {
      id,
      ref: '',
      dateProduction: '',
      qtyPlanned: 0,
      qtyProduced: 0,
      com: '',
    }

    dispatch(addProduct(newProduct))

    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))
  }

  const handleExportFacture = () => {
    const selectedRows = products.filter((r) => rowSelectionModel.ids.has(r.id))

    if (!selectedRows.length) {
      alert('Select rows first')
      return
    }

    dispatch(setDocumentType('facture'))
    dispatch(setSelectedProducts(selectedRows))
    navigate('/invoice')
  }

  const handleExportLivraison = () => {
    const selectedRows = products.filter((r) => rowSelectionModel.ids.has(r.id))

    if (!selectedRows.length) {
      alert('Select rows first')
      return
    }
    dispatch(setDocumentType('livraison'))
    dispatch(setSelectedProducts(selectedRows))
    navigate('/invoice')
  }

  return (
    <Box sx={{ height: '100vh', p: 3, bgcolor: '#f4f6f8' }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* 🔵 Toolbar */}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          sx={{ p: 2 }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
              Add
            </Button>

            {/* 🔵 Facture */}
            <Button
              variant="outlined"
              startIcon={<Description />}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
              }}
              onClick={handleExportFacture}
            >
              Facture
            </Button>

            {/* 🟡 Bon Livraison */}
            <Button
              variant="outlined"
              startIcon={<LocalShipping />}
              sx={{
                borderColor: '#fbc02d',
                color: '#fbc02d',
              }}
              onClick={handleExportLivraison}
            >
              Bon Livraison
            </Button>
          </Stack>
        </Stack>

        <TextField
          size="small"
          label="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
        />

        {/* 🔴 DataGrid */}
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
            onRowSelectionModelChange={setRowSelectionModel}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f0f2f5',
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default ProductGridMUI
