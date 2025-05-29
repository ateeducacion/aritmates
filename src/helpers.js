const valoresNiveles = (x) => {
  // function valoresNiveles(x) {
  let r;
  switch (x) {
    case '21':
    case 21:
      r = 50;
      break;
    case '22':
    case 22:
      r = 100;
      break;
    case '23':
    case 23:
      r = 500;
      break;
    default:
      r = x;
      break;
  }
  return r;
};

export { valoresNiveles };
