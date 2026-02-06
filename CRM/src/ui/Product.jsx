// import { setSelectedProducts } from '../Reducer/invoice/invoiceSlice.js'
// import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material'

import { fakeProducts } from '../util/fakeProducts'

const Product = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ----------------------------
  // Convert date format
  // ----------------------------
  const formattedData = useMemo(() => {
    return fakeProducts.map((p) => {
      const [day, month, year] = p.dateProduction.split('.')
      return {
        ...p,
        jsDate: new Date(`${year}-${month}-${day}`),
      }
    })
  }, [])

  // ----------------------------
  // Totals
  // ----------------------------
  const totalPlanned = formattedData.reduce((s, p) => s + p.qtyPlanned, 0)

  const totalProduced = formattedData.reduce((s, p) => s + p.qtyProduced, 0)

  // ----------------------------
  // Columns
  // ----------------------------
  const columnDefs = [
    {
      field: 'ref',
      headerName: 'Référence',
      flex: 1,
      filter: true,
    },
    {
      field: 'dateProduction',
      headerName: 'Date Production',
      flex: 1,
    },
    {
      field: 'qtyPlanned',
      headerName: 'Planned',
      flex: 1,
    },
    {
      field: 'qtyProduced',
      headerName: 'Produced',
      flex: 1,
      cellStyle: (params) => ({
        color: params.value < params.data.qtyPlanned ? 'orange' : 'green',
        fontWeight: 600,
      }),
    },
  ]

  return (
    <Box sx={{ p: isMobile ? 1 : 4 }}>
      <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight={800} mb={3}>
        Production Dashboard
      </Typography>

      {/* Summary Cards */}
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

      {/* Grid */}
      <Card>
        <CardContent>
          <div
            className="ag-theme-alpine"
            style={{
              height: isMobile ? 400 : 500,
              width: '100%',
            }}
          >
            <AgGridReact
              theme="legacy"
              rowData={formattedData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20]}
              animateRows={true}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: true,
                floatingFilter: true,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Product
