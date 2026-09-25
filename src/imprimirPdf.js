
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Imrimir pdf , usa html2canvas para crear un archivo PDF
 * 
 * @author Fernando Ramirez <fernando.ramirez@altia.es>
 * @author Área de Tecnología Educativa <ate.educacion@gobiernodecanarias.org> (versión simplificada 1.3+)
 * @version 1.0.0-rc1
 * @class ImprimirPdf
 */
class ImprimirPdf {
  constructor(filename='OperacionesMatematicas.pdf') {
    const tag = '[ImprimirPdf.Testpdf]';
    if ( debug ) console.log( tag );

    this.doc = new jsPDF();
    this.filename = filename;
    this.title = 'Hoja Ejercicios Aritmates';
  }

  printImgPages(selector = '#paper') {
    const quality = 1;
    const target = document.querySelector(selector);
    if (!target) {
      throw new Error('PDF target not found: ' + selector);
    }

    html2canvas(target, {
      scale: quality,
      ignoreElements: (element) => element.classList?.contains('pdf-ignore'),
    }).then( (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      this.doc = new jsPDF('p', 'mm');
      let position = 0;

      this.doc.addImage(
          imgData, 'PNG', 0, position, imgWidth, imgHeight
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        this.doc.addPage();
        this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      this.doc.save(this.filename);
    });
  }
}


export default ImprimirPdf;
