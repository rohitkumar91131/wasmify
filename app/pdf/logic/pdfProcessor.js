import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

// ... (keep parsePageRange helper as is) ...
const parsePageRange = (rangeStr, totalPages) => {
  const pages = new Set();
  const parts = rangeStr.split(',');
  parts.forEach(part => {
    const p = part.trim();
    if (p.includes('-')) {
      const [start, end] = p.split('-').map(num => parseInt(num));
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

export const processPdfTool = async (toolName, fileOrFiles, settings) => {
  const name = toolName.toLowerCase();
  
  let fileBuffer;
  if (!Array.isArray(fileOrFiles)) {
     fileBuffer = await fileOrFiles.arrayBuffer();
  }

  // ... (Merge, Split, Protect logic same as before) ...

  // ==========================
  // 1. MERGE PDF
  // ==========================
  if (name.includes("merge")) {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    if (files.length < 2) throw new Error("At least 2 files are required to merge.");
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const fb = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fb);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    return {
        url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
        fileName: `merged_${Date.now()}.pdf`,
        message: "PDFs Merged Successfully"
    };
  }

  // ==========================
  // 2. SPLIT PDF
  // ==========================
  if (name.includes("split")) {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const totalPages = pdfDoc.getPageCount();
    let range = settings.splitRange || "all";
    let indices = [];
    if (range.toLowerCase() === "all" || range.trim() === "") {
       indices = pdfDoc.getPageIndices();
    } else {
       indices = parsePageRange(range, totalPages);
    }
    if (indices.length === 0) throw new Error("Invalid page range.");
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, indices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return {
        url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
        fileName: `split_${Date.now()}.pdf`,
        message: `Extracted ${indices.length} Pages`
    };
  }

  // ==========================
  // 3. PROTECT PDF
  // ==========================
  if (name.includes("protect")) {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const password = settings.password || "1234";
    try {
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: { printing: 'highResolution', modifying: false, copying: false },
      });
    } catch (err) {
      throw new Error("Encryption failed. Update pdf-lib or check console.");
    }
    const pdfBytes = await pdfDoc.save();
    return {
        url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
        fileName: `protected_${Date.now()}.pdf`,
        message: "PDF Encrypted Successfully"
    };
  }

  // ==========================
// ==========================
  // 4. UNLOCK PDF (The "Copy Strategy")
  // ==========================
  if (name.includes("unlock")) {
    const userPassword = settings.password; // UI Input

    try {
        let sourcePdf;

        // Step A: Load the Source PDF
        try {
            if (userPassword) {
                // 1. Try with provided password
                sourcePdf = await PDFDocument.load(fileBuffer, { password: userPassword });
            } else {
                // 2. Try loading normally first
                sourcePdf = await PDFDocument.load(fileBuffer);
            }
        } catch (loadError) {
            // 3. If normal load fails (likely Owner Password restricted), 
            // try ignoring encryption to access content.
            if (loadError.message.includes("EncryptedPDFError")) {
                 sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
            } else {
                throw loadError; // Unknown error
            }
        }

        // Step B: Create a BRAND NEW PDF (This strips encryption metadata)
        const newPdf = await PDFDocument.create();
        
        // Step C: Copy all pages from Source to New
        const indices = sourcePdf.getPageIndices();
        const copiedPages = await newPdf.copyPages(sourcePdf, indices);
        
        copiedPages.forEach((page) => newPdf.addPage(page));

        // Step D: Save the clean PDF
        const pdfBytes = await newPdf.save(); 
        
        return {
            url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
            fileName: `unlocked_${Date.now()}.pdf`,
            message: "Protection Removed Successfully"
        };

    } catch(e) {
        console.error("Unlock Error:", e);
        if (e.message.includes("Password")) {
            throw new Error("File is strictly locked. Please enter the Open Password.");
        }
        throw new Error("Failed to unlock. Ensure the password is correct.");
    }
  }

  // ==========================
  // 5. ROTATE PDF
  // ==========================
  if (name.includes("rotate")) {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages();
    const rotation = parseInt(settings.rotation) || 90;
    pages.forEach(page => {
      const current = page.getRotation().angle;
      page.setRotation(degrees(current + rotation));
    });
    const pdfBytes = await pdfDoc.save();
    return {
        url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
        fileName: `rotated_${Date.now()}.pdf`,
        message: `Rotated by ${rotation}°`
    };
  }

  // ==========================
  // 6. WATERMARK PDF
  // ==========================
  if (name.includes("watermark")) {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages();
    const text = settings.watermarkText || "CONFIDENTIAL";
    const position = settings.watermarkPosition || "center";
    const opacity = settings.watermarkOpacity || 0.3;
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 40; 
    
    pages.forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        let x, y, rotationAngle;
        const margin = 20;

        switch (position) {
            case 'top-left': x=margin; y=height-textHeight-margin; rotationAngle=0; break;
            case 'top-center': x=(width/2)-(textWidth/2); y=height-textHeight-margin; rotationAngle=0; break;
            case 'top-right': x=width-textWidth-margin; y=height-textHeight-margin; rotationAngle=0; break;
            case 'center-left': x=margin; y=(height/2)-(textWidth/2); rotationAngle=90; break;
            case 'center': x=(width/2)-(textWidth/2); y=(height/2)-(textHeight/2); rotationAngle=45; break;
            case 'center-right': x=width-textHeight-margin; y=(height/2)-(textWidth/2); rotationAngle=270; break;
            case 'bottom-left': x=margin; y=margin; rotationAngle=0; break;
            case 'bottom-center': x=(width/2)-(textWidth/2); y=margin; rotationAngle=0; break;
            case 'bottom-right': x=width-textWidth-margin; y=margin; rotationAngle=0; break;
            default: x=(width/2)-(textWidth/2); y=(height/2)-(textHeight/2); rotationAngle=45;
        }

        page.drawText(text, {
            x: x, y: y, size: fontSize, font: font,
            color: rgb(0.95, 0.2, 0.2), opacity: opacity, rotate: degrees(rotationAngle),
        });
    });

    const pdfBytes = await pdfDoc.save();
    return {
        url: URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })),
        fileName: `watermarked_${Date.now()}.pdf`,
        message: "Watermark Added"
    };
  }
  
  throw new Error(`Tool logic for ${toolName} not implemented yet.`);
};