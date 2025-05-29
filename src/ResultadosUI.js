
function descargarPdfResultados(url, formData) {
    console.log('descargarpdfResultado', url );
  
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      console.log('on load');
        if (this.status === 200) {
      console.log('200');
  
            var blob = this.response;
            var filename = "";
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }
  
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);
  
                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location.href = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location.href = downloadUrl;
                }
  
                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
            }
        } else {
          console.log('on load',this.status);
        }
    };
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    console.log('neviar ')
    xhr.send(formData);
  }
  
  function enviarform(url,formData) {
    console.log(
      'enviarForm(url,formData)',
      'url', url,
      'formData', formData
      );    
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          return response.blob(); // Utiliza 'blob' para tratarlo como un archivo
        } else {
          // La solicitud falló, maneja el error aquí
          throw new Error('Error en la solicitud');
        }
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        console.log(a);
        // a.download = 'archivo.pdf'; // Nombre del archivo para la descarga
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);   
      })
      .catch(error => {
        // Maneja errores de la solicitud
        console.log('enviarForm error: ',error);
      });
    
  }

function enviarForm(url, formData) {
  console.log(
    'enviarForm(url,formData)',
    'url', url,
    'formData', ...formData
    ); 
  const formulario = document.createElement('form');
  document.body.appendChild(formulario); // evita error "disconected"

  // formulario.formData= formData;
  // formulario.appendChild(formData);
  for (const entry of formData) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = entry[0];
    input.value = entry[1];
    formulario.appendChild(input);
  }

  formulario.enctype = 'multipart/form-data'; 
  formulario.action = url; 
  formulario.method = 'POST';
  formulario.submit();
}


export {
  descargarPdfResultados, 
  enviarForm as enviarform
};