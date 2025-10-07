import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import { BoardResolution } from "../types/boardMark";

// Add Arabic font support
const addArabicFont = (doc: jsPDF) => {
  // Use a simple approach - convert Arabic to transliterated text for now
  // This is a temporary solution until we can properly embed Arabic fonts
  return doc;
};

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
    console.log('Using Arabic text rendering with html2canvas');
    
    // Create HTML container for Arabic text rendering
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${pageWidth - 64}px`;
    container.style.padding = '32px';
    container.style.background = '#fff';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Noto Sans Arabic', 'Cairo', 'Amiri', 'Arial', sans-serif";
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';
    container.style.color = '#000';
    
    container.innerHTML = `
      <div style="text-align: center; font-size: 20px; font-weight: bold; color: #0C085C; margin-bottom: 20px;">
        محضر اجتماع مجلس الإدارة
      </div>
      <div style="margin-bottom: 16px; text-align: justify;">
        ${resolution.dabajaTextAr}
      </div>
      <div style="margin-bottom: 16px; text-align: justify;">
        ${resolution.preambleAr}
      </div>
      <div style="font-size: 12px; color: #333; margin-bottom: 8px;">
        تاريخ الاجتماع: ${new Date(resolution.meetingDate).toLocaleDateString('ar-SA')}
      </div>
      <div style="font-size: 14px; color: #0C085C; font-weight: bold; margin: 16px 0 8px;">
        قرار المجلس:
      </div>
      <div style="margin-bottom: 16px; text-align: justify; white-space: pre-wrap;">
        ${resolution.agreementDetails || ''}
      </div>
      <div style="font-size: 14px; color: #0C085C; font-weight: bold; margin: 16px 0 8px;">
        التوقيع:
      </div>
      ${resolution.signatories.map(s => `
        <div style="margin-bottom: 24px; border: 1px solid #ddd; border-radius: 8px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 14px; font-weight: bold; color: #0C085C;">
              ${s.name || ''}
            </div>
            <div style="font-size: 12px; color: #666;">
              مرجع: ${s.id || ''}
            </div>
          </div>
          <div style="height: 60px; border: 1px dashed #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
            ${s.signedAt ? 
              `<span style="font-size: 12px; color: #16a34a; font-weight: bold;">موقّع إلكترونياً - ${new Date(s.signedAt).toLocaleString('ar-SA')}</span>` : 
              `<span style="font-size: 12px; color: #9ca3af;">لم يُوقّع بعد</span>`
            }
          </div>
        </div>
      `).join('')}
    `;

    // Add barcode
    const barcodePayload = resolution.barcodeData || `${resolution.id}`;
    const barcodeUrl = generateBarcodeDataUrl(barcodePayload);
    const barcode = document.createElement('img');
    barcode.src = barcodeUrl;
    barcode.alt = 'barcode';
    barcode.style.width = '260px';
    barcode.style.marginTop = '16px';
    barcode.style.display = 'block';
    barcode.style.marginLeft = 'auto';
    barcode.style.marginRight = 'auto';
    container.appendChild(barcode);

    document.body.appendChild(container);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if ((document as any).fonts && (document as any).fonts.ready) {
      try { 
        await (document as any).fonts.ready; 
        console.log('Fonts loaded');
      } catch (e) {
        console.log('Font loading error:', e);
      }
    }
    
    await new Promise<void>((resolve) => {
      if (barcode.complete) return resolve();
      barcode.onload = () => resolve();
      barcode.onerror = () => resolve();
    });
    
    console.log('Generating PDF with html2canvas...');
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    console.log('Canvas generated:', canvas.width, 'x', canvas.height);
    document.body.removeChild(container);
    
    if (canvas.width > 0 && canvas.height > 0) {
      const imgData = canvas.toDataURL('image/png');
      const margin = 32;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const ratio = Math.min(contentWidth / canvas.width, contentHeight / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    } else {
      console.error('Canvas is empty, using fallback');
      // Fallback to English text
      doc.setFontSize(16);
      doc.setTextColor(12, 8, 92);
      doc.text('Board Resolution Record', pageWidth / 2, 64, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let y = 96;
      const writeParagraph = (text: string, yStart: number) => {
        const lines = doc.splitTextToSize(text, pageWidth - 96);
        doc.text(lines, 48, yStart);
        return yStart + lines.length * 16 + 8;
      };
      
      y = writeParagraph(resolution.dabajaTextEn, y);
      y = writeParagraph(resolution.preambleEn, y);
      y = writeParagraph(resolution.agreementDetails || '', y);
    }
    
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


