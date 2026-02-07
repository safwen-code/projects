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
import { DataGrid } from '@mui/x-data-grid'
import { Add, Delete, PictureAsPdf } from '@mui/icons-material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ProductGridMUI = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [rows, setRows] = useState([
    { id: 1, client: 'Ali', product: 'Coffee Machine', qty: 2, price: 1200 },
    { id: 2, client: 'Sami', product: 'Grinder', qty: 1, price: 400 },
  ])

  const [selectionModel, setSelectionModel] = useState([])
  const [search, setSearch] = useState('')

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()),
    )
  }, [rows, search])

  const columns = [
    { field: 'client', headerName: 'Client', flex: 1, editable: true },
    { field: 'product', headerName: 'Product', flex: 1, editable: true },
    {
      field: 'qty',
      headerName: 'Qty',
      flex: 1,
      editable: true,
      type: 'number',
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      editable: true,
      type: 'number',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          color="error"
          size="small"
          startIcon={<Delete />}
          onClick={() =>
            setRows((prev) => prev.filter((r) => r.id !== params.row.id))
          }
        >
          Delete
        </Button>
      ),
    },
  ]

  const handleAdd = () => {
    setRows((prev) => [
      {
        id: Date.now(),
        client: '',
        product: '',
        qty: 0,
        price: 0,
      },
      ...prev,
    ])
  }

  const handleExportPdf = () => {
    const selectedRows = rows.filter((r) => selectionModel.includes(r.id))

    if (!selectedRows.length) return alert('Select rows first')

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
    <Box sx={{ height: '100vh', p: isMobile ? 1 : 3, bgcolor: '#f4f6f8' }}>
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
        {/* ✅ Toolbar عادي بدون GridToolbarContainer */}
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

        <Box sx={{ flex: 1 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) =>
              setSelectionModel(newSelection)
            }
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
