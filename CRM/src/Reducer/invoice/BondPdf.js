import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
export function generateBonLivraisonPdf({ invoice, items, logo }) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15

  const blue = [41, 128, 185]

  /* ===================================== */
  /*               HEADER                  */
  /* ===================================== */

  doc.setTextColor(...blue)

  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('وصل تسليم', pageWidth / 2, 18, { align: 'center' })

  doc.setFontSize(18)
  doc.text('Bon de Livraison', pageWidth / 2, 26, { align: 'center' })

  /* ===================================== */
  /*        RECTANGLE FOR LOGO             */
  /* ===================================== */

  const rectX = margin
  const rectY = 35
  const rectWidth = 60
  const rectHeight = 35

  doc.setDrawColor(...blue)
  doc.rect(rectX, rectY, rectWidth, rectHeight)

  // 👇 لو عندك logo base64
  if (logo) {
    doc.addImage(logo, 'PNG', rectX + 2, rectY + 2, 56, 31)
  }

  /* ===================================== */
  /*          DOCUMENT META INFO           */
  /* ===================================== */

  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')

  doc.text(`N° : ${invoice.documentNumber}`, pageWidth - 70, 45)
  doc.text(`Date : ${invoice.documentDate}`, pageWidth - 70, 52)

  doc.text(`Doit Mr : ${invoice.client.name}`, margin, 80)

  /* ===================================== */
  /*                TABLE                  */
  /* ===================================== */

  const tableBody = items.map((p) => [
    String(p.qtyProduced ?? ''),
    p.ref ?? '',
    '',
    '',
  ])

  autoTable(doc, {
    startY: 90,
    head: [['Qté', 'Désignations', 'Prix Unit', 'Prix Total']],
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center',
      textColor: 20,
      lineColor: blue,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: blue,
      lineColor: blue,
      lineWidth: 0.5,
      fontStyle: 'bold',
    },
  })

  /* ===================================== */
  /*                FOOTER                 */
  /* ===================================== */

  const finalY = doc.lastAutoTable.finalY + 15

  doc.setFontSize(11)
  doc.text('Arrêté le présent bon de livraison à la somme de :', margin, finalY)

  doc.rect(margin, finalY + 5, pageWidth - margin * 2, 15)

  doc.save(`bon_livraison_${invoice.documentNumber}.pdf`)
}
