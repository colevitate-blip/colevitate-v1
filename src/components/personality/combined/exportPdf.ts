// Renders a DOM node (see PdfDocument.tsx) to a multi-page PDF entirely
// client-side. This deliberately avoids window.print(): the browser print
// dialog stamps its own date/URL/page-number header and footer that no
// page can suppress, and reflows content into page breaks with no regard
// for where a card or list happens to end. Here we control both — page
// breaks only ever fall between the [data-pdf-section] blocks the caller
// marks, never through the middle of one.
export async function exportProfileAsPdf(container: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-pdf-section]"));
  const containerTop = container.getBoundingClientRect().top;
  const sectionBottoms = sections.map((el) => el.getBoundingClientRect().bottom - containerTop);
  const sectionTops = sections.map((el) => el.getBoundingClientRect().top - containerTop);

  const scale = 1.5;
  const canvas = await html2canvas(container, { scale, backgroundColor: "#ffffff" });
  const pxPerDomPx = canvas.width / container.offsetWidth;

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 28;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  // pt-per-canvas-px once the canvas is scaled down to fit the page width.
  const k = usableWidth / canvas.width;
  const maxSlicePx = usableHeight / k;

  // Greedily accumulate sections until the next one would overflow the
  // page, then cut at that section's top edge (in canvas px). A single
  // section taller than a full page (rare) falls back to a hard cut at
  // the page limit rather than growing the page unboundedly.
  const cutsDomPx: number[] = [];
  let pageStartDomPx = 0;
  for (let i = 0; i < sections.length; i++) {
    const bottom = sectionBottoms[i];
    if ((bottom - pageStartDomPx) * pxPerDomPx > maxSlicePx) {
      const top = sectionTops[i];
      if (top <= pageStartDomPx) {
        // this single section alone exceeds a page — force a break at the limit
        const forced = pageStartDomPx + maxSlicePx / pxPerDomPx;
        cutsDomPx.push(forced);
        pageStartDomPx = forced;
      } else {
        cutsDomPx.push(top);
        pageStartDomPx = top;
      }
    }
  }
  cutsDomPx.push(container.offsetHeight);

  const sliceCanvas = document.createElement("canvas");
  const sliceCtx = sliceCanvas.getContext("2d");
  if (!sliceCtx) return;

  let startDomPx = 0;
  cutsDomPx.forEach((cutDomPx, i) => {
    const startPx = Math.round(startDomPx * pxPerDomPx);
    const endPx = Math.round(cutDomPx * pxPerDomPx);
    const slicePx = endPx - startPx;
    if (slicePx <= 0) {
      startDomPx = cutDomPx;
      return;
    }

    sliceCanvas.width = canvas.width;
    sliceCanvas.height = slicePx;
    // JPEG has no alpha channel — fill white first so any edge transparency
    // in the source doesn't turn black once re-encoded as JPEG below.
    sliceCtx.fillStyle = "#ffffff";
    sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    sliceCtx.drawImage(canvas, 0, startPx, canvas.width, slicePx, 0, 0, canvas.width, slicePx);

    if (i > 0) pdf.addPage();
    const imgHeightPt = slicePx * k;
    // JPEG at high quality: the page is almost entirely flat white with
    // text and a few solid-color chips, where PNG's lossless encoding
    // produces a needlessly large file (10+ MB for a two-page report).
    pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, usableWidth, imgHeightPt);

    startDomPx = cutDomPx;
  });

  pdf.save(fileName);
}
