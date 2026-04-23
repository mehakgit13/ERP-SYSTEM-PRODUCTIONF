import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('NexusERP', 14, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Enterprise Resource Planning System', 14, 30);

  // Invoice label
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(invoice.invoiceNumber || 'INV-XXXX', pageWidth - 14, 30, { align: 'right' });

  // Reset
  doc.setTextColor(30, 30, 30);

  // Bill To
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.customer?.name || 'N/A', 14, 63);
  doc.text(invoice.customer?.email || '', 14, 70);
  const addr = invoice.customer?.address;
  if (addr) doc.text(`${addr.city || ''}, ${addr.country || ''}`.replace(', ,', ''), 14, 77);

  // Invoice Meta
  const metaX = pageWidth - 80;
  const metaData = [
    ['Issue Date:', new Date(invoice.issueDate).toLocaleDateString()],
    ['Due Date:',  new Date(invoice.dueDate).toLocaleDateString()],
    ['Status:',    invoice.status?.toUpperCase() || 'UNPAID'],
    ['Order Ref:', invoice.salesOrder?.orderNumber || 'N/A'],
  ];
  doc.setFontSize(9);
  metaData.forEach(([label, val], i) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, metaX, 55 + i * 8);
    doc.setFont('helvetica', 'normal');
    doc.text(val, metaX + 30, 55 + i * 8);
  });

  // Line Items Table
  const tableData = (invoice.items || []).map(item => [
    item.description,
    item.quantity,
    `$${Number(item.unitPrice).toFixed(2)}`,
    `$${Number(item.total).toFixed(2)}`,
  ]);

  doc.autoTable({
    startY: 90,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: { 3: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals
  const totalsX = pageWidth - 80;
  const totals = [
    ['Subtotal:', `$${Number(invoice.subtotal || 0).toFixed(2)}`],
    ['Tax:',      `$${Number(invoice.tax || 0).toFixed(2)}`],
    ['Discount:', `-$${Number(invoice.discount || 0).toFixed(2)}`],
  ];
  doc.setFontSize(9);
  totals.forEach(([label, val], i) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, totalsX, finalY + i * 8);
    doc.text(val, pageWidth - 14, finalY + i * 8, { align: 'right' });
  });

  // Grand Total
  doc.setFillColor(17, 24, 39);
  doc.rect(totalsX - 4, finalY + 22, pageWidth - totalsX + 4, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL DUE:', totalsX, finalY + 31);
  doc.text(`$${Number(invoice.grandTotal || 0).toFixed(2)}`, pageWidth - 14, finalY + 31, { align: 'right' });

  // Notes
  if (invoice.notes) {
    doc.setTextColor(100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Notes: ${invoice.notes}`, 14, finalY + 50);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business. Please remit payment by the due date.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`${invoice.invoiceNumber || 'invoice'}.pdf`);
};
