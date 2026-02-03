import { Box, Button, Stack, Typography } from '@mui/material'
import DataGrid, {
  Column,
  Editing,
  Paging,
  Selection,
  Export,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid'

import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from '../Reducer/products/productsSlice.js'

import { setSelectedProducts } from '../Reducer/invoice/invoiceSlice.js'
import { useNavigate } from 'react-router-dom'

// Excel / PDF Export (DevExtreme official)
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter'
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter'

import ExcelJS from 'exceljs'
import saveAs from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Product = () => {
  const products = useAppSelector((s) => s.products.list)
  const dispatch = useAppDispatch()
  const nav = useNavigate()

  // ---------------------------
  // CRUD HANDLERS
  // ---------------------------

  const onRowInserting = (e) => {
    // DevExtreme default behavior يحاول يضيف للـ dataSource،
    // وإحنا نحب Redux هو اللي يتحكم => نمنع الإضافة الافتراضية
    e.cancel = true
    dispatch(addProduct(e.data))
  }

  const onRowUpdating = (e) => {
    e.cancel = true
    dispatch(
      updateProduct({ id: e.key, changes: { ...e.oldData, ...e.newData } }),
    )
  }

  const onRowRemoving = (e) => {
    e.cancel = true
    dispatch(deleteProduct(e.key))
  }

  const onSelectionChanged = (e) => {
    dispatch(setSelectedProducts(e.selectedRowKeys))
  }

  // ---------------------------
  // EXPORT HANDLER
  // ---------------------------

  const onExporting = async (e) => {
    // Excel
    if (e.format === 'xlsx') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Products')

      await exportDataGridToExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      })

      const buffer = await workbook.xlsx.writeBuffer()
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        'products.xlsx',
      )
      e.cancel = true
    }

    // PDF
    if (e.format === 'pdf') {
      const doc = new jsPDF()

      await exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,
      })

      doc.save('products.pdf')
      e.cancel = true
    }
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
          Products
        </Typography>

        <Button variant="contained" onClick={() => nav('/invoice')}>
          Facture
        </Button>
      </Stack>

      <DataGrid
        dataSource={products}
        keyExpr="id"
        showBorders
        columnAutoWidth
        repaintChangesOnly
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        // CRUD events
        onRowInserting={onRowInserting}
        onRowUpdating={onRowUpdating}
        onRowRemoving={onRowRemoving}
      >
        <Selection mode="multiple" />
        <Paging defaultPageSize={10} />

        <Editing
          mode="row"
          allowAdding
          allowUpdating
          allowDeleting
          useIcons
          confirmDeleteMessage="هل أنت متأكد من حذف هذا المنتج؟"
        />

        {/* Export formats */}
        <Export enabled allowExportSelectedData formats={['xlsx', 'pdf']} />

        <Toolbar>
          <Item name="addRowButton" />
          <Item name="exportButton" />
          <Item location="after">
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              اختر المنتجات ثم اضغط Facture
            </Typography>
          </Item>
        </Toolbar>

        <Column dataField="ref" caption="Réf Produit" />
        <Column dataField="dateProduction" caption="Date de production" />
        <Column
          dataField="qtyPlanned"
          caption="Quantité planifiée"
          dataType="number"
        />
        <Column
          dataField="qtyProduced"
          caption="Quantité produite"
          dataType="number"
        />
        <Column dataField="com" caption="COM" />
      </DataGrid>
    </Box>
  )
}

export default Product
