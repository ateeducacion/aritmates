
// import * as jsPDF from 'jspdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Imrimir pdf , usa html2canvas para crear un archivo PDF
 * 
 * @author Fernando Ramirez <fernando.ramirez@altia.es>
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @version 1.0.0-rc1
 * @class ImprimirPdf
 */
class ImprimirPdf {
  constructor(filename='OperacionesMatematicas.pdf') {
    const tag = '[ImprimirPdf.Testpdf]';
    if ( debug ) console.log( tag );
    global.html2canvas = html2canvas;
    // eslint-disable-next-line new-cap
    this.doc = new jsPDF();
    this.filename = filename;
    this.title = 'Hoja Ejercicios Aritmates';
    this.plantilla = {};
    this.plantillaCargada = false;
  }

  printAsImg(quality = 1) {
    const tag = '[ImprimirPdf.printAsImg(quality = 1)]';
    if ( debug ) console.log( tag );


    html2canvas(document.querySelector('#nodeToRenderAsPDF'),
        {scale: quality}
    ).then((canvas) => {
      // const pdf = new jsPDF('p', 'mm', 'a4');
      // default a4 values:
      // const a4width = 211;
      // const a4height = 298;
      this.doc.addImage(
          // canvas.toDataURL('image/png'), 'PNG', 0, 0, a4width, a4height*5
          canvas.toDataURL('image/png'), 'PNG', 0, 0
      );
      // this.doc.save(this.filename);
      this.doc.output('dataurlnewwindow');
    });
  }

  printImgPages( ) {
    const quality = 1;
    html2canvas(document.querySelector('#paper'),
        {scale: quality}
    ).then( (canvas) => {
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
      // this.doc.output('dataurlnewwindow');

    });
  }

  printHtmlToPdf(html) {
    const tag = '[ImprimirPdf.printHtmlToPdf(html)]';
    if ( debug ) console.log( tag );
    // html = ' <style>body{ background-color: red} </stlye>' + html;

    const elementHandler = {
      '#ignorePDF': function(element, renderer) {
        return true;
      },
      '.ignore': function(element, renderer) {
        return true;
      },
    };

    // console.log(this.plantilla);
    // console.log('-------------------');
    const htmlDoc = (new DOMParser())
        .parseFromString(this.plantilla, 'text/html');

    global.htmldoc = htmlDoc;
    console.log('htmldoc', htmlDoc);
    const contenido = htmlDoc.querySelector('.contenido');
    contenido.innerHTML = html;

    this.doc.fromHTML(
        htmldoc.body.innerHTML, 0, 0,
        {
          'width': 95,
          'elementHandlers': elementHandler,
          // 'elementHandlers': specialElementHandlers,
        },
        (x) => this.doc.output('dataurlnewwindow')
    );

    // this.doc.output('dataurlnewwindow');
    // this.doc.output('newwindow');
  }

  printAddHtml(html) {
    const tag = '[ImprimirPdf.printAddHtml(html)]';
    if ( debug ) console.log( tag );

    // const newDoc = document.implementation.createHTMLDocument(this.title);
    // newDoc.body.innerHTML = html;

    // Supuestamente este esta deprecated pero se ve mejor que .html()
    this.doc.addHTML( html, 0, 0, {}, (x) => {
      x.output('dataurlnewwindow');
    });
  }

  addHTML(html) {
    const tag = '[imprimirPdf.js.addHTML(html)]';
    if ( debug ) console.log( tag );

    // this.doc.html( html, {
    //   callback: function(d) {
    //     d.save(); // devuelve el archivo con un formato terrible
    //     // this.doc = d;
    //   },
    // });

    // Supuestamente este esta deprecated pero se ve mejor
    // eslint-disable-next-line new-cap
    new jsPDF().addHTML( html, 0, 0, {}, (x) => {
      console.log( 'holaaddhtml');
      console.log(this.doc);
      this.doc = x;
      // x.output('dataurlnewwindow');
    });
  }

  addText( text ) {
    const x = 0;
    const y = this.y;

    this.doc.text(text, x, y );
  }

  print( ) {
    // this.doc.output('dataurlnewwindow');
    // this.doc.output('pdfobjectnewwindow');
    this.doc.output('dataurlnewwindow', {filename: this.filename});
  }

  // devolver promise para saber si se ha cargado o no
  cargarPlantilla() {
    // const debug = true;
    const tag = '[imprimirPdf.js.cargarPlantilla]';
    if ( debug ) console.log( tag );
    return new Promise((resolve, reject) => {
      fetch('./templates/plantillaPdf.html')
          .then((response) => response.text() )
          .then((data) => {
            if (debug) console.log(tag, 'plantilla cargada');
            if (debug) console.log(tag, 'data', data);
            this.plantilla = data;
            if (debug) console.log(tag, 'plantilla', this.plantilla);
            resolve('plantilla cargada');
          });
    });
  }
}


export default ImprimirPdf;
