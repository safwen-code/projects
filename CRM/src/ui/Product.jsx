import { useMemo, useState, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { fakeProducts } from '../util/fakeProducts'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const Product = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const gridRef = useRef()

  const [rowData, setRowData] = useState(
    fakeProducts.map((p) => {
      const [day, month, year] = p.dateProduction.split('.')
      return { ...p, jsDate: new Date(`${year}-${month}-${day}`) }
    }),
  )

  const totalPlanned = useMemo(
    () => rowData.reduce((s, p) => s + p.qtyPlanned, 0),
    [rowData],
  )
  const totalProduced = useMemo(
    () => rowData.reduce((s, p) => s + p.qtyProduced, 0),
    [rowData],
  )

  const onCellValueChanged = useCallback((params) => {
    setRowData((prev) =>
      prev.map((r) => (r.id === params.data.id ? params.data : r)),
    )
  }, [])

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      ref: '',
      dateProduction: '',
      qtyPlanned: 0,
      qtyProduced: 0,
      com: '',
      jsDate: new Date(),
    }
    setRowData((prev) => [newItem, ...prev])
    gridRef.current?.api?.ensureIndexVisible(0)
  }

  const deleteRenderer = (params) => (
    <Button
      color="error"
      size="small"
      onClick={() =>
        setRowData((prev) => prev.filter((r) => r.id !== params.data.id))
      }
    >
      Delete
    </Button>
  )

  const columnDefs = [
    { field: 'ref', headerName: 'Référence', flex: 1, editable: true },
    {
      field: 'dateProduction',
      headerName: 'Date Production',
      flex: 1,
      editable: true,
    },
    { field: 'qtyPlanned', headerName: 'Planned', flex: 1, editable: true },
    {
      field: 'qtyProduced',
      headerName: 'Produced',
      flex: 1,
      editable: true,
      cellStyle: (params) => ({
        color: params.value < params.data.qtyPlanned ? 'orange' : 'green',
        fontWeight: 600,
      }),
    },
    { field: 'com', headerName: 'COM', flex: 1, editable: true },
    {
      headerName: 'Actions',
      cellRenderer: deleteRenderer,
      flex: 1,
      maxWidth: 120,
    },
  ]

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 4,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight={800} mb={3}>
        Production Dashboard
      </Typography>

      {/* Summary */}
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2">Total Planned</Typography>
            <Typography variant="h5" fontWeight={700}>
              {totalPlanned.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2">Total Produced</Typography>
            <Typography variant="h5" fontWeight={700}>
              {totalProduced.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2">Completion %</Typography>
            <Typography variant="h5" fontWeight={700}>
              {((totalProduced / totalPlanned) * 100).toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction="row" mb={2}>
        <Button variant="contained" onClick={handleAdd}>
          Add Product
        </Button>
      </Stack>

      {/* Grid */}
      {/* Grid */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <div
          className="ag-theme-alpine"
          style={{ height: '100%', width: '100%' }}
        >
          <AgGridReact
            ref={gridRef}
            theme="legacy"
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              floatingFilter: true,
              editable: true,
            }}
            editType="fullRow"
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </Box>
    </Box>
  )
}

export default Product
