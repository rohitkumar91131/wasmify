import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

// Supported output MIME types for image formats
const FORMAT_MIME = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

/**
 * Processes a single image buffer using sharp based on the toolName and settings.
 */
async function processWithSharp(toolName, inputBuffer, settings) {
  const name = toolName.toLowerCase().replace(/[\s/]+/g, '-');
  let img = sharp(inputBuffer);

  // ===========================
  // FORMAT CONVERSION
  // ===========================
  if (name.includes('format')) {
    const fmt = (settings.format || 'png').toLowerCase();
    const outBuf = await img.toFormat(fmt === 'jpg' ? 'jpeg' : fmt).toBuffer();
    const ext = fmt === 'jpeg' ? 'jpg' : fmt;
    return { buffer: outBuf, mimeType: FORMAT_MIME[ext] || 'image/png', ext };
  }

  // ===========================
  // RESIZE / SCALE
  // ===========================
  if (name.includes('resize')) {
    const meta = await img.metadata();
    let width, height;
    if (settings.resizeMode === 'fixed') {
      width = parseInt(settings.targetWidth) || 1080;
    } else {
      const scale = parseFloat(settings.resizeScale) || 0.5;
      width = Math.round(meta.width * scale);
      height = Math.round(meta.height * scale);
    }
    const outBuf = await img.resize(width, height || null, { fit: 'inside', withoutEnlargement: false }).toBuffer();
    return { buffer: outBuf, mimeType: 'image/png', ext: 'png' };
  }

  // ===========================
  // COMPRESSION
  // ===========================
  if (name.includes('compress')) {
    const quality = Math.round((parseFloat(settings.quality) || 0.7) * 100);
    const outBuf = await img.jpeg({ quality }).toBuffer();
    return { buffer: outBuf, mimeType: 'image/jpeg', ext: 'jpg' };
  }

  // ===========================
  // CROP
  // ===========================
  if (name.includes('crop')) {
    const ratio = parseFloat(settings.aspectRatio) || 16 / 9;
    const meta = await img.metadata();
    const { width: w, height: h } = meta;
    let cropW, cropH;
    if (w / h > ratio) {
      cropH = h;
      cropW = Math.round(h * ratio);
    } else {
      cropW = w;
      cropH = Math.round(w / ratio);
    }
    const left = Math.round((w - cropW) / 2);
    const top = Math.round((h - cropH) / 2);
    const outBuf = await img.extract({ left, top, width: cropW, height: cropH }).toBuffer();
    return { buffer: outBuf, mimeType: 'image/png', ext: 'png' };
  }

  // ===========================
  // ROTATE / FLIP
  // ===========================
  if (name.includes('rotate') || name.includes('flip')) {
    const rotate = parseInt(settings.rotate) || 0;
    const flipH = !!settings.flipH;
    const flipV = !!settings.flipV;
    if (rotate) img = img.rotate(rotate);
    if (flipH) img = img.flop();
    if (flipV) img = img.flip();
    const outBuf = await img.toBuffer();
    return { buffer: outBuf, mimeType: 'image/png', ext: 'png' };
  }

  // ===========================
  // WATERMARK (SVG text overlay)
  // ===========================
  if (name.includes('watermark')) {
    const meta = await img.metadata();
    const { width: w, height: h } = meta;
    const text = settings.watermarkText || 'Watermark';
    const size = parseInt(settings.watermarkSize) || 40;
    const color = settings.watermarkColor || '#ffffff';
    const position = settings.watermarkPos || 'center';
    const padding = 40;

    // Approximate text width (rough estimate: 0.6 * fontSize per char)
    const textWidth = Math.min(text.length * size * 0.6, w - padding * 2);
    let x, y, anchor;

    switch (position) {
      case 'tl': x = padding; y = padding + size; anchor = 'start'; break;
      case 'tr': x = w - padding; y = padding + size; anchor = 'end'; break;
      case 'bl': x = padding; y = h - padding; anchor = 'start'; break;
      case 'br': x = w - padding; y = h - padding; anchor = 'end'; break;
      default:   x = w / 2; y = h / 2; anchor = 'middle'; break;
    }

    const svg = Buffer.from(
      `<svg width="${w}" height="${h}">
        <text
          x="${x}" y="${y}"
          font-family="sans-serif" font-size="${size}" font-weight="bold"
          fill="${color}" opacity="0.5" text-anchor="${anchor}"
        >${text.replace(/[<>&"']/g, '')}</text>
      </svg>`
    );

    const outBuf = await img
      .composite([{ input: svg, blend: 'over' }])
      .toBuffer();
    return { buffer: outBuf, mimeType: 'image/png', ext: 'png' };
  }

  // ===========================
  // METADATA CLEANER (strip EXIF)
  // ===========================
  if (name.includes('metadata')) {
    const outBuf = await img.withMetadata(false).toBuffer();
    return { buffer: outBuf, mimeType: 'image/png', ext: 'png' };
  }

  throw new Error(`Image tool "${toolName}" is not supported on the server.`);
}

/**
 * Converts one or more image buffers into a PDF using pdf-lib.
 */
async function imagesToPdf(imageBuffers, imageTypes, settings) {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < imageBuffers.length; i++) {
    const buf = imageBuffers[i];
    const type = imageTypes[i] || 'image/jpeg';

    // Ensure JPEG for embedding (pdf-lib supports jpg and png)
    let embeddedImage;
    if (type === 'image/png') {
      // Convert to PNG buffer (already is)
      embeddedImage = await pdfDoc.embedPng(buf);
    } else {
      // Convert to JPEG for everything else
      const jpegBuf = await sharp(buf).jpeg({ quality: 90 }).toBuffer();
      embeddedImage = await pdfDoc.embedJpg(jpegBuf);
    }

    const { width: imgW, height: imgH } = embeddedImage;

    // Paper size in points (A4: 595x842, Letter: 612x792)
    const paperSize = settings.pdfPaperSize || 'a4';
    const isLandscape = (settings.pdfOrientation || 'portrait') === 'landscape';
    let pageW = paperSize === 'letter' ? 612 : 595;
    let pageH = paperSize === 'letter' ? 792 : 842;
    if (isLandscape) [pageW, pageH] = [pageH, pageW];

    const marginPt = ((settings.pdfMargin || 10) * 2.835); // mm → points
    const contentW = pageW - marginPt * 2;
    const contentH = pageH - marginPt * 2;

    const scale = Math.min(contentW / imgW, contentH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const x = marginPt + (contentW - drawW) / 2;
    const y = marginPt + (contentH - drawH) / 2;

    const page = pdfDoc.addPage([pageW, pageH]);
    page.drawImage(embeddedImage, { x, y, width: drawW, height: drawH });
  }

  return Buffer.from(await pdfDoc.save());
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tool = formData.get('tool');
    const settings = JSON.parse(formData.get('settings') || '{}');

    if (!tool) {
      return NextResponse.json({ error: 'Missing tool parameter' }, { status: 400 });
    }

    const timestamp = Date.now();

    // ===========================
    // IMAGE TO PDF (multi-file)
    // ===========================
    if (tool === 'Image to PDF') {
      const files = formData.getAll('files');
      if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No image files provided' }, { status: 400 });
      }

      const buffers = [];
      const types = [];
      for (const f of files) {
        buffers.push(Buffer.from(await f.arrayBuffer()));
        types.push(f.type || 'image/jpeg');
      }

      const pdfBuffer = await imagesToPdf(buffers, types, settings);
      const fileName = `document_${timestamp}.pdf`;

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-File-Name': fileName,
        },
      });
    }

    // ===========================
    // SINGLE IMAGE TOOLS
    // ===========================
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const { buffer: outputBuffer, mimeType, ext } = await processWithSharp(tool, inputBuffer, settings);
    const fileName = `edited_${timestamp}.${ext}`;

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-File-Name': fileName,
      },
    });
  } catch (err) {
    console.error('[API /api/image] Error:', err.message);
    return NextResponse.json({ error: err.message || 'Image processing failed' }, { status: 500 });
  }
}
