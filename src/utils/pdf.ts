import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import { BoardResolution } from "../types/boardMark";

function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

// Note: We avoid font embedding for Arabic due to cmap issues; we rasterize Arabic content reliably instead.

function generateBarcodeDataUrl(text: string): string {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE128",
    displayValue: false,
    margin: 0,
    width: 2,
    height: 40,
  });
  return canvas.toDataURL("image/png");
}

export async function generateResolutionPDF(resolution: BoardResolution, locale: 'ar' | 'en'): Promise<string> 
{
  const dynamicText = [
    resolution.agreementDetails || '',
    ...resolution.signatories.map(s => `${s.name || ''} ${s.jobTitle || ''}`),
  ].join(' ');
  const isAr = locale === 'ar' || containsArabic(dynamicText);
  
  console.log('PDF Generation Debug:', {
    locale,
    isAr,
    dynamicText: dynamicText.substring(0, 100),
    agreementDetails: resolution.agreementDetails?.substring(0, 50),
    signatoriesCount: resolution.signatories.length
  });
  
  const doc = new jsPDF({ orientation: "p", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (isAr) {
    console.log('Using Arabic text rendering (simplified)');
    
    // Direct text rendering for Arabic - no html2canvas
    doc.setFontSize(16);
    doc.setTextColor(12, 8, 92);
    doc.text('محضر اجتماع مجلس الإدارة', pageWidth / 2, 64, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 96;
    
    const writeParagraph = (text: string, yStart: number) => {
      const lines = doc.splitTextToSize(text, pageWidth - 96);
      doc.text(lines, 48, yStart);
      return yStart + lines.length * 16 + 8;
    };
    
    // Add content
    y = writeParagraph(resolution.dabajaTextAr, y);
    y = writeParagraph(resolution.preambleAr, y);
    
    // Meeting date
    doc.setFontSize(11);
    doc.text(`تاريخ الاجتماع: ${new Date(resolution.meetingDate).toLocaleDateString('ar-SA')}`, 48, y);
    y += 20;
    
    // Resolution title
    doc.setFontSize(12);
    doc.setTextColor(12, 8, 92);
    doc.text('قرار المجلس:', 48, y);
    y += 18;
    
    // Resolution content
    doc.setTextColor(0, 0, 0);
    y = writeParagraph(resolution.agreementDetails || '', y);
    
    // Signatures section
    doc.setFontSize(12);
    doc.setTextColor(12, 8, 92);
    doc.text('التوقيع:', 48, y + 20);
    y += 40;
    
    resolution.signatories.forEach((s, idx) => {
      // Signature box
      const boxWidth = pageWidth - 96;
      const boxHeight = 60;
      const boxX = 48;
      const boxY = y;
      
      // Draw signature box border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxWidth, boxHeight);
      
      // Name and reference
      doc.setFontSize(12);
      doc.setTextColor(12, 8, 92);
      doc.text(`${s.name || ''}`, boxX + 10, boxY + 15);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`مرجع: ${s.id || ''}`, boxX + boxWidth - 10, boxY + 15, { align: 'right' });
      
      // Signature status
      doc.setFontSize(10);
      if (s.signedAt) {
        doc.setTextColor(22, 163, 74);
        doc.text(`موقّع إلكترونياً - ${new Date(s.signedAt).toLocaleString('ar-SA')}`, boxX + 10, boxY + 35);
      } else {
        doc.setTextColor(150, 150, 150);
        doc.text('لم يُوقّع بعد', boxX + 10, boxY + 35);
      }
      
      y += boxHeight + 20;
    });
    
    // Add barcode
    const barcodePayload = resolution.barcodeData || `${resolution.id}`;
    const barcodeUrl = generateBarcodeDataUrl(barcodePayload);
    doc.addImage(barcodeUrl, 'PNG', pageWidth - 48 - 180, y, 160, 40);
    
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    return url;
  }

  // English: keep vector text rendering
  const padding = 48;
  const dabaja = resolution.dabajaTextEn;
  const preamble = resolution.preambleEn;
  const agreement = resolution.agreementDetails;

  doc.setFontSize(16);
  doc.setTextColor(12, 8, 92);
  doc.text('Board Resolution Record', pageWidth / 2, 64, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const writeParagraph = (text: string, yStart: number) => {
    const lines = doc.splitTextToSize(text, pageWidth - padding * 2);
    doc.text(lines, padding, yStart);
    return yStart + lines.length * 16 + 8;
  };

  let y = 96;
  y = writeParagraph(dabaja, y);
  y = writeParagraph(preamble, y);
  doc.setFontSize(11);
  doc.text(`Meeting Date: ${new Date(resolution.meetingDate).toLocaleDateString('en-US')}`, padding, y);
  y += 20;
  doc.setFontSize(12);
  doc.setTextColor(12, 8, 92);
  doc.text('Resolution:', padding, y);
  y += 18;
  doc.setTextColor(0, 0, 0);
  y = writeParagraph(agreement, y);

  doc.setFontSize(12);
  doc.setTextColor(12, 8, 92);
  doc.text('Signatures:', padding, y);
  y += 20;
  doc.setTextColor(0, 0, 0);
  
  for (let idx = 0; idx < resolution.signatories.length; idx++) {
    const s = resolution.signatories[idx];
    
    // Signature box
    const boxWidth = pageWidth - padding * 2;
    const boxHeight = 60;
    const boxX = padding;
    const boxY = y;
    
    // Draw signature box border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(boxX, boxY, boxWidth, boxHeight);
    
    // Name and reference
    doc.setFontSize(12);
    doc.setTextColor(12, 8, 92);
    doc.text(`${s.name || ''}`, boxX + 10, boxY + 15);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Reference: ${s.id || ''}`, boxX + boxWidth - 10, boxY + 15, { align: 'right' });
    
    // Signature status
    doc.setFontSize(10);
    if (s.signedAt) {
      doc.setTextColor(22, 163, 74);
      doc.text(`Signed electronically - ${new Date(s.signedAt).toLocaleString('en-US')}`, boxX + 10, boxY + 35);
      
      // If signature image is available, embed it
      if (s.signatureImageDataUrl || s.signatureImageUrl) {
        try {
          const imgData = s.signatureImageDataUrl || s.signatureImageUrl!;
          const sigW = 100;
          const sigH = 30;
          const imgX = boxX + boxWidth - sigW - 10;
          const imgY = boxY + 25;
          doc.addImage(imgData, 'PNG', imgX, imgY, sigW, sigH);
        } catch {
          // ignore image errors
        }
      }
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text('Not signed yet', boxX + 10, boxY + 35);
    }
    
    y += boxHeight + 20; // Move to next signature box
  }
  y += 20;
  const barcodePayload = resolution.barcodeData || `${resolution.id}`;
  const barcodeUrl = generateBarcodeDataUrl(barcodePayload);
  doc.addImage(barcodeUrl, 'PNG', pageWidth - padding - 180, y - 20, 160, 40);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Verification Code', pageWidth - padding - 100, y + 30, { align: 'center' });
  doc.setTextColor(120);
  doc.setFontSize(9);
  doc.text('Digitally signed document - official archival copy', pageWidth / 2, doc.internal.pageSize.getHeight() - 36, { align: 'center' });
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  return url as unknown as string;
}


