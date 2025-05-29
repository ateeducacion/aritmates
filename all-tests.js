
global.debug = false;

let context = require.context('./test', true, /.js$/);
context.keys().forEach(context);
export default context;
