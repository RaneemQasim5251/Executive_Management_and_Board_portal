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
  const doc = new jsPDF({ orientation: "p", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (isAr) {
    // Reliable raster path for Arabic or mixed Arabic content
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.opacity = '0';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.style.width = `${pageWidth - 64}px`;
    container.style.padding = '32px';
    container.style.background = '#fff';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'Noto Sans Arabic','Cairo','Amiri',sans-serif";
    container.innerHTML = `
      <div style="color:#0C085C;font-size:20px;font-weight:800;text-align:center;margin-bottom:16px">محضر قرار مجلس الإدارة</div>
      <div style="font-size:14px;line-height:1.9;color:#111;margin-bottom:12px">${resolution.dabajaTextAr}</div>
      <div style="font-size:14px;line-height:1.9;color:#111;margin-bottom:12px">${resolution.preambleAr}</div>
      <div style="font-size:12px;color:#333;margin-bottom:8px">تاريخ الاجتماع: ${new Date(resolution.meetingDate).toLocaleDateString('ar-SA')}</div>
      <div style="font-size:14px;color:#0C085C;font-weight:700;margin:16px 0 8px">قرار المجلس</div>
      <div style="font-size:14px;line-height:1.9;color:#111;margin-bottom:16px;white-space:pre-wrap">${resolution.agreementDetails || ''}</div>
      <div style="font-size:14px;color:#0C085C;font-weight:700;margin:16px 0 8px">التواقيع</div>
      ${resolution.signatories.map(s => `
        <div style=\"display:flex;justify-content:space-between;border:1px solid #eee;border-radius:8px;padding:10px 12px;margin-bottom:8px\">
          <div>الاسم: ${s.name || ''}</div>
          <div>المنصب: ${s.jobTitle || ''}</div>
          <div>${s.signedAt ? 'تاريخ التوقيع: ' + new Date(s.signedAt).toLocaleString('ar-SA') : 'بانتظار التوقيع'}</div>
        </div>
      `).join('')}
    `;

    const barcodePayload = resolution.barcodeData || `${resolution.id}`;
    const barcodeUrl = generateBarcodeDataUrl(barcodePayload);
    const barcode = document.createElement('img');
    barcode.src = barcodeUrl;
    barcode.alt = 'barcode';
    barcode.style.width = '260px';
    barcode.style.marginTop = '16px';
    container.appendChild(barcode);

    document.body.appendChild(container);
    await new Promise(requestAnimationFrame);
    if ((document as any).fonts && (document as any).fonts.ready) {
      try { await (document as any).fonts.ready; } catch {}
    }
    await new Promise<void>((resolve) => {
      if (barcode.complete) return resolve();
      barcode.onload = () => resolve();
      barcode.onerror = () => resolve();
    });
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      removeContainer: true,
      foreignObjectRendering: true,
    });
    document.body.removeChild(container);
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
    return doc.output('dataurlstring');
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
  doc.text('Signatures', padding, y);
  y += 16;
  doc.setTextColor(0, 0, 0);
  const colWidth = (pageWidth - padding * 2) / 2;
  let colX = padding;
  let rowY = y;
  resolution.signatories.forEach((s, idx) => {
    const block = [
      `Name: ${s.name || ''}`,
      `Title: ${s.jobTitle || ''}`,
      `Signed At: ${s.signedAt ? new Date(s.signedAt).toLocaleString('en-US') : 'Pending'}`,
    ];
    doc.text(block, colX, rowY);
    if ((idx + 1) % 2 === 0) {
      rowY += 80;
      colX = padding;
    } else {
      colX = padding + colWidth;
    }
  });
  y = rowY + 100;
  const barcodePayload = resolution.barcodeData || `${resolution.id}`;
  const barcodeUrl = generateBarcodeDataUrl(barcodePayload);
  doc.addImage(barcodeUrl, 'PNG', pageWidth - padding - 180, y - 20, 160, 40);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Verification Code', pageWidth - padding - 100, y + 30, { align: 'center' });
  doc.setTextColor(120);
  doc.setFontSize(9);
  doc.text('Digitally signed document - official archival copy', pageWidth / 2, doc.internal.pageSize.getHeight() - 36, { align: 'center' });
  return doc.output('dataurlstring');
}


