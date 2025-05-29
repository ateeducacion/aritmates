
global.debug = false;

let context = require.context('./testSelenium', true, /.+suma2operandos\.spec\.js$/);
context.keys().forEach(context);
export default context;
