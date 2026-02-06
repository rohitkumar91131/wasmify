import { jsPDF } from "jspdf"; 

export const processImageTool = async (toolName, fileOrFiles, settings) => {
  
  // ============================================================
  //  SCENARIO A: IMAGE TO PDF (Using createImageBitmap - Faster/Stable)
  // ============================================================
  if (toolName === "Image to PDF") {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new jsPDF({
          orientation: settings.pdfOrientation || "portrait",
          unit: "mm",
          format: settings.pdfPaperSize || "a4"
        });

        const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
        
        if (files.length === 0) throw new Error("No files selected");

        const margin = settings.pdfMargin || 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Safety Check: Empty or non-image file
          if (file.size === 0) continue;
          if (!file.type.startsWith("image/")) continue;

          if (i > 0) doc.addPage();

          let bitmap;
          try {
            // 🚀 MAGIC FIX: createImageBitmap directly decodes the Blob
            // It skips the DOM <img> tag overhead entirely.
            bitmap = await createImageBitmap(file);
          } catch (err) {
            console.error("Bitmap failed, trying fallback", err);
            // Fallback for very obscure formats if bitmap fails
            throw new Error(`Could not decode image: ${file.name}`);
          }

          // 2. Draw Bitmap to Canvas (Normalize to JPEG)
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d');
          
          // White background (for transparent PNGs)
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bitmap, 0, 0);
          
          // Free memory immediately
          bitmap.close(); 

          // 3. Compress to JPEG (High quality 0.9 is safe)
          const safeDataUrl = canvas.toDataURL("image/jpeg", 0.9);

          // 4. Calculate Dimensions (Fit to Page)
          const imgRatio = canvas.width / canvas.height;
          let finalWidth = contentWidth;
          let finalHeight = contentWidth / imgRatio;

          if (finalHeight > contentHeight) {
            finalHeight = contentHeight;
            finalWidth = contentHeight * imgRatio;
          }

          const x = margin + (contentWidth - finalWidth) / 2;
          const y = margin + (contentHeight - finalHeight) / 2;

          doc.addImage(safeDataUrl, 'JPEG', x, y, finalWidth, finalHeight);
        }

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        resolve({
          message: "Success",
          details: `Combined ${files.length} images into PDF`,
          downloadUrl: url,
          fileName: `document_${Date.now()}.pdf`
        });

      } catch (error) {
        reject(new Error(error.message || "PDF generation failed"));
      }
    });
  }

  // ============================================================
  //  SCENARIO B: SINGLE IMAGE TOOLS (Also upgraded to Bitmap)
  // ============================================================
  
  if (!fileOrFiles) return Promise.reject(new Error("No file provided"));
  const file = fileOrFiles; 

  return new Promise(async (resolve, reject) => {
    try {
      // Use createImageBitmap here too for consistency & speed
      const bitmap = await createImageBitmap(file);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = bitmap.width;
      let height = bitmap.height;

      // --- LOGIC: Setup Canvas Dimensions based on Tool ---
      if (toolName === "Rotate / Flip") {
         const rotate = settings.rotate || 0;
         if (rotate === 90 || rotate === 270) {
           canvas.width = height;
           canvas.height = width;
         } else {
           canvas.width = width;
           canvas.height = height;
         }
      } 
      else if (toolName === "Crop") {
         const ratio = settings.aspectRatio || 1.77;
         if (width / height > ratio) {
            canvas.width = height * ratio;
            canvas.height = height;
         } else {
            canvas.width = width;
            canvas.height = width / ratio;
         }
      }
      else if (toolName === "Resize / Scale") {
         if (settings.resizeMode === "fixed") {
            const w = settings.targetWidth || width;
            const r = height / width;
            canvas.width = w;
            canvas.height = w * r;
         } else {
            const s = settings.resizeScale || 1.0;
            canvas.width = width * s;
            canvas.height = height * s;
         }
      }
      else {
         // Default (Watermark, Format, etc.)
         canvas.width = width;
         canvas.height = height;
      }

      // --- LOGIC: Apply Transformations ---
      if (toolName === "Rotate / Flip") {
        const rotate = settings.rotate || 0;
        const flipH = settings.flipH ? -1 : 1;
        const flipV = settings.flipV ? -1 : 1;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(flipH, flipV);

        if (rotate === 90 || rotate === 270) {
           ctx.drawImage(bitmap, -height / 2, -width / 2);
        } else {
           ctx.drawImage(bitmap, -width / 2, -height / 2);
        }
      }
      else if (toolName === "Crop") {
        // Draw centered crop
        // Source X/Y
        let sx = 0, sy = 0, sWidth = width, sHeight = height;
        const ratio = settings.aspectRatio || 1.77;
        
        if (width / height > ratio) {
           sWidth = height * ratio;
           sx = (width - sWidth) / 2;
        } else {
           sHeight = width / ratio;
           sy = (height - sHeight) / 2;
        }
        ctx.drawImage(bitmap, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      }
      else {
         // Standard Draw
         ctx.imageSmoothingEnabled = true;
         ctx.imageSmoothingQuality = 'high';
         ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      }

      bitmap.close(); // Free memory

      // --- LOGIC: Post-Processing (Watermark) ---
      if (toolName === "Watermark") {
          const text = settings.watermarkText || "Watermark";
          const size = settings.watermarkSize || 40;
          const color = settings.watermarkColor || "#ffffff";
          const position = settings.watermarkPos || "center";

          ctx.font = `bold ${size}px sans-serif`;
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.5;

          const textMetrics = ctx.measureText(text);
          let x = (canvas.width - textMetrics.width) / 2;
          let y = canvas.height / 2;
          const padding = 40;

          if (position === "br") { x = canvas.width - textMetrics.width - padding; y = canvas.height - padding; }
          if (position === "bl") { x = padding; y = canvas.height - padding; }
          if (position === "tr") { x = canvas.width - textMetrics.width - padding; y = padding + size; }
          if (position === "tl") { x = padding; y = padding + size; }

          ctx.fillText(text, x, y);
      }

      // --- EXPORT ---
      let mimeType = "image/png";
      let quality = 0.9;
      let ext = "png";

      if (toolName === "Format Conversion") {
          ext = settings.format || "png";
          if (ext === "jpg") mimeType = "image/jpeg";
          if (ext === "webp") mimeType = "image/webp";
      }
      
      if (toolName === "Compression") {
          mimeType = "image/jpeg";
          quality = settings.quality || 0.7;
          ext = "jpg";
      }

      canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Export failed")); return; }
          const url = URL.createObjectURL(blob);
          resolve({
            message: "Success",
            details: `Processed Image (${canvas.width}x${canvas.height})`,
            downloadUrl: url,
            fileName: `edited_${Date.now()}.${ext}`
          });
        }, mimeType, quality);

    } catch (err) {
      reject(new Error("Processing Failed: " + err.message));
    }
  });
};