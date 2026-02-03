import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateInvoicePdf({ invoice, items }) {
  const doc = new jsPDF('p', 'mm', 'a4')

  // Header
  doc.setFontSize(22)
  doc.text('FACTURE', 105, 18, { align: 'center' })

  doc.setFontSize(11)
  doc.text(`FACTURE N° ${invoice.factureNumber}`, 105, 28, { align: 'center' })
  doc.text(`DATE : ${invoice.factureDate}`, 105, 34, { align: 'center' })

  // Seller
  doc.setFontSize(11)
  doc.text(invoice.seller.companyName, 14, 45)
  doc.setFontSize(9)
  doc.text(invoice.seller.slogan, 14, 50)
  doc.text(invoice.seller.address, 14, 56)
  doc.text(invoice.seller.city, 14, 61)
  doc.text(`Téléphone : ${invoice.seller.phone}`, 14, 66)

  // Client
  doc.setFontSize(11)
  doc.text('AUPRES DE :', 14, 78)
  doc.setFontSize(10)
  doc.text(invoice.client.name, 14, 84)
  doc.text(invoice.client.company, 14, 89)
  doc.text(invoice.client.address, 14, 94)
  doc.text(invoice.client.city, 14, 99)
  doc.text(`Téléphone : ${invoice.client.phone}`, 14, 104)

  // Table
  const tableBody = items.map((p) => [
    p.ref,
    p.dateProduction,
    String(p.qtyPlanned ?? ''),
    String(p.qtyProduced ?? ''),
    p.com ?? '',
  ])

  autoTable(doc, {
    startY: 115,
    head: [['Réf Produit', 'Date', 'Qté planifiée', 'Qté produite', 'COM']],
    body: tableBody,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [20, 20, 20] },
  })

  const y = doc.lastAutoTable.finalY + 15

  doc.setFontSize(10)
  doc.text('NOUS VOUS REMERCIONS DE VOTRE CONFIANCE.', 105, y + 25, {
    align: 'center',
  })

  doc.save(`facture_${invoice.factureNumber}.pdf`)
}
