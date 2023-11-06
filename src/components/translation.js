const fs = require('fs');
const i18n = require("i18n");

i18n.configure({
  locales:['en','es'],
  defaultLocale: 'es',
  register: global,
  directory: __dirname + '/translation'
});

// Carga un archivo JSON en una variable
function cargarArchivoJSON(rutaArchivo) {
    try {
      const contenidoArchivo = fs.readFileSync(rutaArchivo, 'utf-8');
      return JSON.parse(contenidoArchivo);
    } catch (error) {
      console.error('Error al cargar el archivo JSON:', error);
      return null;
    }
}
exports.setlocales = (locales)=>{
  i18n.setLocale(locales);
}
exports.trans =(text)=>{
  return i18n.__(text);
}
exports.translation = (idiomaDestino) =>{
    let url = '';
    if(idiomaDestino === 'es'){
        url=__dirname + "/translation/es.json";
    }else if (idiomaDestino === 'en'){
        url=__dirname + "/translation/en.json";
    }
    return cargarArchivoJSON(url);
}