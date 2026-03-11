import { NextResponse } from 'next/server';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

const parsePageRange = (rangeStr, totalPages) => {
  const pages = new Set();
  const parts = rangeStr.split(',');
  parts.forEach((part) => {
    const p = part.trim();
    if (p.includes('-')) {
      const [start, end] = p.split('-').map((n) => parseInt(n));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) pages.add(i - 1);
        }
      }
    } else {
      const num = parseInt(p);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pages.add(num - 1);
      }
    }
  });
  return Array.from(pages).sort((a, b) => a - b);
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tool = formData.get('tool');
    const settings = JSON.parse(formData.get('settings') || '{}');

    if (!tool) {
      return NextResponse.json({ error: 'Missing tool parameter' }, { status: 400 });
    }

    const name = tool.toLowerCase();
    const timestamp = Date.now();

    // ===========================
    // 1. MERGE PDF
    // ===========================
    if (name.includes('merge')) {
      const files = formData.getAll('files');
      if (!files || files.length < 2) {
        return NextResponse.json({ error: 'At least 2 PDF files are required to merge' }, { status: 400 });
      }
      const mergedPdf = await PDFDocument.create();
      for (const f of files) {
        const buf = Buffer.from(await f.arrayBuffer());
        const pdf = await PDFDocument.load(buf);
        const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copied.forEach((p) => mergedPdf.addPage(p));
      }
      const bytes = await mergedPdf.save();
      const fileName = `merged_${timestamp}.pdf`;
      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    // All other tools need a single file
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
    }
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // ===========================
    // 2. SPLIT PDF
    // ===========================
    if (name.includes('split')) {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const totalPages = pdfDoc.getPageCount();
      const range = settings.splitRange || 'all';
      let indices;
      if (range.toLowerCase() === 'all' || range.trim() === '') {
        indices = pdfDoc.getPageIndices();
      } else {
        indices = parsePageRange(range, totalPages);
      }
      if (indices.length === 0) throw new Error('Invalid page range.');
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(pdfDoc, indices);
      copied.forEach((p) => newPdf.addPage(p));
      const bytes = await newPdf.save();
      const fileName = `split_${timestamp}.pdf`;
      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    // ===========================
    // 3. PROTECT PDF
    // ===========================
    if (name.includes('protect')) {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const password = settings.password || '1234';
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: { printing: 'highResolution', modifying: false, copying: false },
      });
      const bytes = await pdfDoc.save();
      const fileName = `protected_${timestamp}.pdf`;
      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    // ===========================
    // 4. UNLOCK PDF
    // ===========================
    if (name.includes('unlock')) {
      const userPassword = settings.password;
      let sourcePdf;
      try {
        sourcePdf = userPassword
          ? await PDFDocument.load(fileBuffer, { password: userPassword })
          : await PDFDocument.load(fileBuffer);
      } catch (loadErr) {
        if (loadErr.message && loadErr.message.includes('EncryptedPDFError')) {
          sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        } else {
          throw loadErr;
        }
      }
      const newPdf = await PDFDocument.create();
      const indices = sourcePdf.getPageIndices();
      const copied = await newPdf.copyPages(sourcePdf, indices);
      copied.forEach((p) => newPdf.addPage(p));
      const bytes = await newPdf.save();
      const fileName = `unlocked_${timestamp}.pdf`;
      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    // ===========================
    // 5. ROTATE PDF
    // ===========================
    if (name.includes('rotate')) {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const rotation = parseInt(settings.rotation) || 90;
      pages.forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + rotation));
      });
      const bytes = await pdfDoc.save();
      const fileName = `rotated_${timestamp}.pdf`;
      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    // ===========================
    // 6. WATERMARK PDF
    // ===========================
    if (name.includes('watermark')) {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const text = settings.watermarkText || 'CONFIDENTIAL';
      const position = settings.watermarkPosition || 'center';
      const opacity = parseFloat(settings.watermarkOpacity) || 0.3;
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 40;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        let x, y, rotationAngle;
        const margin = 20;

        switch (position) {
          case 'top-left':      x = margin; y = height - textHeight - margin; rotationAngle = 0; break;
          case 'top-center':    x = width / 2 - textWidth / 2; y = height - textHeight - margin; rotationAngle = 0; break;
          case 'top-right':     x = width - textWidth - margin; y = height - textHeight - margin; rotationAngle = 0; break;
          case 'center-left':   x = margin; y = height / 2 - textWidth / 2; rotationAngle = 90; break;
          case 'center-right':  x = width - textHeight - margin; y = height / 2 - textWidth / 2; rotationAngle = 270; break;
          case 'bottom-left':   x = margin; y = margin; rotationAngle = 0; break;
          case 'bottom-center': x = width / 2 - textWidth / 2; y = margin; rotationAngle = 0; break;
          case 'bottom-right':  x = width - textWidth - margin; y = margin; rotationAngle = 0; break;
          default:              x = width / 2 - textWidth / 2; y = height / 2 - textHeight / 2; rotationAngle = 45;
        }

        page.drawText(text, {
          x, y, size: fontSize, font,
          color: rgb(0.95, 0.2, 0.2), opacity, rotate: degrees(rotationAngle),
        });
      });

      const bytes = await pdfDoc.save();
      const fileName = `watermarked_${timestamp}.pdf`;
      return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    return NextResponse.json({ error: `PDF tool "${tool}" is not supported` }, { status: 400 });
  } catch (err) {
    console.error('[API /api/pdf] Error:', err.message);
    return NextResponse.json({ error: err.message || 'PDF processing failed' }, { status: 500 });
  }
}
