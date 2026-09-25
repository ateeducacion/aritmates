let loading;

function addScript(path) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(path, document.baseURI).href;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${path}`));
    document.head.appendChild(script);
  });
}

/** html2canvas and jsPDF are only needed when printing. */
export function whenPdfLibraries() {
  if (window.html2canvas && (window.jspdf || window.jsPDF)) {
    return Promise.resolve();
  }
  if (!loading) {
    loading = Promise.all([
      addScript('vendor/html2canvas/html2canvas.min.js'),
      addScript('vendor/jspdf/jspdf.umd.min.js'),
    ]);
  }
  return loading;
}
