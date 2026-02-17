import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateBonLivraisonPdf({ invoice, items, logo }) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const blue = [41, 128, 185]

  doc.setTextColor(...blue)

  /* ===================================== */
  /*              TITLE                    */
  /* ===================================== */

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('Bon de Livraison', pageWidth - margin, 20, { align: 'right' })

  /* ===================================== */
  /*      MOVE N° AND DATE (RED AREA)     */
  /* ===================================== */

  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')

  const infoX = pageWidth - margin - 40 // نحركهم شوية لليسار
  const infoY = 28

  doc.text(`N° : ${invoice.factureNumber || ''}`, infoX, infoY)
  doc.text(`Date : ${invoice.documentDate || ''}`, infoX, infoY + 7)

  /* ===================================== */
  /*            LOGO RECTANGLE             */
  /* ===================================== */

  const rectX = margin
  const rectY = 20
  const rectWidth = 65
  const rectHeight = 35

  doc.setDrawColor(...blue)
  doc.rect(rectX, rectY, rectWidth, rectHeight)

  if (logo) {
    doc.addImage(logo, 'PNG', rectX + 2, rectY + 2, 61, 31)
  }

  /* ===================================== */
  /*            CLIENT NAME                */
  /* ===================================== */

  doc.text(`Doit Mr : ${invoice.client?.name || ''}`, margin, 65)

  /* ===================================== */
  /*            TABLE                      */
  /* ===================================== */

  let grandTotal = 0

  const body = items.map((p) => {
    const qty = Number(p.qtyProduced || 0)
    const unit = Number(p.price || 0)
    const total = qty * unit
    grandTotal += total

    return [qty, p.ref || '', unit.toFixed(2), total.toFixed(2)]
  })

  /* ✅ TOTAL ROW WITH COLSPAN (REMOVE YELLOW LINES) */
  body.push([
    {
      content: '',
      colSpan: 2, // دمج أول زوز أعمدة
      styles: { halign: 'center' },
    },
    {
      content: 'TOTAL',
      styles: { fontStyle: 'bold' },
    },
    {
      content: grandTotal.toFixed(2) + ' DT',
      styles: { fontStyle: 'bold' },
    },
  ])

  autoTable(doc, {
    startY: 75,
    head: [['Qté', 'Désignations', 'Prix Unit', 'Prix Total']],
    body: body,
    theme: 'grid',
    styles: {
      fontSize: 10,
      halign: 'center',
      lineColor: blue,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: blue,
      fontStyle: 'bold',
      lineColor: blue,
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 80 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
    },

    didParseCell: function (data) {
      const isTotalRow = data.row.index === body.length - 1

      if (isTotalRow) {
        // 🔥 الخلية المدموجة (Qté + Désignations)
        if (data.column.index === 0) {
          data.cell.styles.lineWidth = 0 // نحيو كل الخطوط
          data.cell.styles.fillColor = [255, 255, 255]
        }

        // TOTAL
        if (data.column.index === 2) {
          data.cell.styles.fontStyle = 'bold'
        }

        // Amount
        if (data.column.index === 3) {
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
  })

  /* ===================================== */
  /*        FOOTER SENTENCE                */
  /* ===================================== */

  const finalY = doc.lastAutoTable.finalY + 15

  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  doc.text('Arrêté le présent bon de livraison à la somme de :', margin, finalY)

  doc.save(`bon_livraison_${invoice.factureNumber}.pdf`)
}
