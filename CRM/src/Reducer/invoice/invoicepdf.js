import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateInvoicePdf({ invoice, items }) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()

  /* ===================================== */
  /*                HEADER                 */
  /* ===================================== */

  doc.setFontSize(24)
  doc.setFont(undefined, 'bold')
  doc.text('FACTURE', pageWidth / 2, 20, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')
  doc.text(`FACTURE N° ${invoice.factureNumber}`, pageWidth / 2, 28, {
    align: 'center',
  })
  doc.text(`DATE : ${invoice.factureDate}`, pageWidth / 2, 34, {
    align: 'center',
  })

  // Horizontal line
  doc.setDrawColor(180)
  doc.line(14, 40, pageWidth - 14, 40)

  /* ===================================== */
  /*          SELLER & CLIENT BOX          */
  /* ===================================== */

  const leftX = 14
  const rightX = pageWidth / 2 + 5
  const boxWidth = pageWidth / 2 - 20
  const startY = 50
  const boxHeight = 40

  // Seller Box
  doc.rect(leftX, startY, boxWidth, boxHeight)

  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text(invoice.seller.companyName, leftX + 4, startY + 8)

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(invoice.seller.slogan, leftX + 4, startY + 14)
  doc.text(invoice.seller.address, leftX + 4, startY + 20)
  doc.text(invoice.seller.city, leftX + 4, startY + 26)
  doc.text(`Téléphone : ${invoice.seller.phone}`, leftX + 4, startY + 32)

  // Client Box
  doc.rect(rightX, startY, boxWidth, boxHeight)

  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  doc.text('AUPRES DE :', rightX + 4, startY + 8)

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(invoice.client.name, rightX + 4, startY + 14)
  doc.text(invoice.client.company, rightX + 4, startY + 20)
  doc.text(invoice.client.address, rightX + 4, startY + 26)
  doc.text(invoice.client.city, rightX + 4, startY + 32)
  doc.text(`Téléphone : ${invoice.client.phone}`, rightX + 4, startY + 38)

  /* ===================================== */
  /*                 TABLE                 */
  /* ===================================== */

  const tableBody = items.map((p) => [
    p.ref,
    p.dateProduction,
    String(p.qtyPlanned ?? ''),
    String(p.qtyProduced ?? ''),
    p.com ?? '',
  ])

  autoTable(doc, {
    startY: startY + boxHeight + 15,
    head: [['Réf Produit', 'Date', 'Qté planifiée', 'Qté produite', 'COM']],
    body: tableBody,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: 255,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    theme: 'grid',
  })

  const finalY = doc.lastAutoTable.finalY

  /* ===================================== */
  /*                FOOTER                 */
  /* ===================================== */

  doc.setDrawColor(180)
  doc.line(14, finalY + 10, pageWidth - 14, finalY + 10)

  doc.setFontSize(10)
  doc.text(
    'NOUS VOUS REMERCIONS DE VOTRE CONFIANCE.',
    pageWidth / 2,
    finalY + 20,
    { align: 'center' },
  )

  doc.save(`facture_${invoice.factureNumber}.pdf`)
}
