
global.debug = false;

let context = require.context('./test', true, /.+resultadoNegativo\.spec\.js$/);

context.keys().forEach(context);
export default context;
