// lib/services/pdfExporter.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportItineraryToPDF(itineraryTitle: string, days: any[], totalInvestment: number) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Magnificent Header Banner
  doc.setFillColor(26, 26, 26); // Deep charcoal
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Gold Accent Bar
  doc.setFillColor(212, 175, 55); 
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ESCAPE TOURS MASTER BLUEPRINT', 14, 20);
  
  // Subtitle / Itinerary Name
  doc.setFontSize(12);
  doc.setTextColor(212, 175, 55); 
  doc.text(itineraryTitle || 'Safari Odyssey Master Itinerary', 14, 32);

  // Metadata Timestamp on Header Right
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 20, { align: 'right' });
  doc.text('escapetourstz.com', pageWidth - 14, 32, { align: 'right' });

  let currentY = 55;

  // 2. Iterate through Days and Build Detailed Tables
  days.forEach((day) => {
    // Check for page overflow
    if (currentY > 260) {
      doc.addPage();
      currentY = 25;
    }

    // Day Header Section
    doc.setFillColor(245, 245, 245);
    doc.rect(14, currentY, pageWidth - 28, 8, 'F');
    
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`DAY ${day.day_number}: ${day.title || 'Expedition Leg'}`, 18, currentY + 6);
    
    currentY += 12;

    const tableData = (day.slots || []).map((slot: any) => {
      const slotType = (slot.type || 'SLOT').toUpperCase();
      const itemName = slot.item?.name || 'Unassigned Slot';
      const category = slot.item?.category || slot.category || 'N/A';
      const description = slot.item?.description || slot.item?.metadata?.description || 'Curated & secured wildlife experience.';
      const price = Number(slot.item?.price || slot.price || 0);

      return [
        slotType,
        `${itemName}\n\n• Details: ${description}`,
        category,
        `$${price.toFixed(2)}`
      ];
    });

    (doc as any).autoTable({
      startY: currentY,
      head: [['Slot', 'Experience / Accommodation & Description', 'Category', 'Investment']],
      body: tableData.length > 0 ? tableData : [['-', 'No items assigned for this day slot.', '-', '$0.00']],
      theme: 'grid',
      headStyles: { 
        fillColor: [26, 26, 26], 
        textColor: [212, 175, 55],
        fontStyle: 'bold',
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' },
        1: { cellWidth: 95 },
        2: { cellWidth: 35 },
        3: { cellWidth: 27, halign: 'right', fontStyle: 'bold' }
      },
      styles: { fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
      alternateRowStyles: { fillColor: [250, 250, 250] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  });

  // 3. Grand Total Summary Box
  if (currentY > 240) {
    doc.addPage();
    currentY = 30;
  }

  doc.setFillColor(26, 26, 26);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL ESTIMATED INVESTMENT (USD):', 22, currentY + 14);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.text(`$${totalInvestment.toFixed(2)}`, pageWidth - 22, currentY + 14, { align: 'right' });

  // Footer Note
  currentY += 32;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Escape Tours • Curated & Secured African Wilderness Expeditions • All rights reserved.', pageWidth / 2, currentY, { align: 'center' });

  // Trigger browser download
  doc.save(`${(itineraryTitle || 'Safari-Odyssey').replace(/\s+/g, '-')}-Master-Blueprint.pdf`);
}