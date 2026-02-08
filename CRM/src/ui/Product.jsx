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
  Add,
  Delete,
  Edit,
  Save,
  Close,
  PictureAsPdf,
} from '@mui/icons-material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { useAppSelector } from '../app/hooks'
// import { useDispatch } from 'react-redux'

const ProductGridMUI = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const products = useAppSelector((state) => state.products.listPrd)
  console.log(products)

  // const dispatch = useDispatch()
  const [rows, setRows] = useState([
    { id: 1, client: 'Ali', product: 'Coffee Machine', qty: 2, price: 1200 },
    { id: 2, client: 'Sami', product: 'Grinder', qty: 1, price: 400 },
  ])

  const [rowModesModel, setRowModesModel] = useState({})

  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  })

  const [search, setSearch] = useState('')

  // 🔎 Search
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()),
    )
  }, [rows, search])

  // ✅ Update row
  const processRowUpdate = (newRow) => {
    setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)))
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
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  const columns = [
    { field: 'client', headerName: 'Client', flex: 1, editable: true },
    { field: 'product', headerName: 'Product', flex: 1, editable: true },
    {
      field: 'qty',
      headerName: 'Qty',
      type: 'number',
      flex: 1,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 1,
      editable: true,
    },

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
    setRows((prev) => [
      { id, client: '', product: '', qty: 0, price: 0 },
      ...prev,
    ])
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }))
  }

  const handleExportPdf = () => {
    const selectedRows = rows.filter((r) => rowSelectionModel.ids.has(r.id))

    if (!selectedRows.length) {
      alert('Select rows first')
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

            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPdf}
            >
              Export PDF
            </Button>
          </Stack>

          <TextField
            size="small"
            label="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
        </Stack>

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
