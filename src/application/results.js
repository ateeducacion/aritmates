import $ from 'jquery';
import {scoreBadges, speedBadges} from './badges';
import utils from '../utils';
import ImprimirPdf from '../imprimirPdf';
import {whenPdfLibraries} from '../pdfLibs';

function hideBadges() {
  $('.part_resultado #rowInsignia .puntos .circulo.mini').hide();
}

function showScoreBadges(score) {
  const badges = scoreBadges(score, 10);
  const row = '.part_resultado #rowInsignia';
  for (const name of ['bronze', 'silver', 'gold', 'platinum', 'perfect']) {
    if (badges[name]) $(`${row} .${name}`).show();
  }
}

function showSpeedBadges(spentMs, maxSeconds) {
  const row = '.part_resultado #rowVelocidad';
  for (const name of ['bronze', 'silver', 'gold', 'platinum']) {
    $(`${row} .${name}`).css('visibility', 'hidden');
  }

  const badges = speedBadges(spentMs, maxSeconds);
  for (const name of ['bronze', 'silver', 'gold', 'platinum']) {
    if (badges[name]) $(`${row} .${name}`).css('visibility', 'visible');
  }
}

function appendCorrections(score, exam) {
  score.operacionesMal.forEach((value, key) => {
    const operation = exam.operacionesExamen[key];
    const solution = operation.respuesta();
    const row = $('<tr>')
        .append('<td>' + operation.toStringUserInput(value) + '</td>')
        .append('<td>' + operation.toStringUserInput(solution) + '</td>');
    $('#correciones tbody').append(row);
  });
}

function bindResultActions() {
  $('#btnVolverEmpezar').on('click', () => {
    location.reload();
  });

  $('#btnDownloadScore').on('click', () => {
    whenPdfLibraries().then(() => {
      const printer = new ImprimirPdf('Aritmates-Resultados.pdf');
      window.scrollTo(0, 0);
      printer.printImgPages('#interior');
    }).catch((error) => {
      console.error(error);
    });
  });
}

/**
 * Render the result template and populate it from the completed exam.
 *
 * @param {Object} params
 * @param {Object} params.score
 * @param {Object} params.options
 * @param {Object} params.exam
 * @param {Object} [params.helpDrawer]
 * @return {Promise<void>}
 */
export async function renderResults({score, options, exam, helpDrawer}) {
  console.time('resultados');
  $('#ejercicios > div').hide();

  const response = await fetch('./templates/part_resultado.html');
  if (!response.ok) {
    throw new Error('Could not load result template');
  }
  const template = await response.text();

  $('#ejercicios').hide();
  $('#newContent').remove();
  $('#ejercicios').append('<div class="container" id="newContent"></div>');
  $('#newContent').append(template);
  hideBadges();

  $('#ejercicios .score #aciertos').text(score.aciertos);
  $('#ejercicios .score #fallos').text(score.fallos);
  $('#ejercicios .score #tiempoConsumido')
      .text(utils.milisToMinSg(score.tiempoConsumido));

  if (options.cuentaAtras != 0) {
    $('#ejercicios .score #tiempoTotal')
        .text(utils.milisToMinSg(options.cuentaAtras * 1000));
    showSpeedBadges(score.tiempoConsumido, options.cuentaAtras);
  } else {
    $('#ejercicios .score #tiempoTotal').hide();
    $('#ejercicios .score #tiempoSeparador').hide();
    $('#ejercicios #rowVelocidad').css('visibility', 'hidden');
  }

  $('#ejercicios .score #tiempoMedio')
      .text(utils.milisToMinSg(score.tiempoMedioEjercicio));
  $('#ejercicios .score #ejerciciosCompletados').text(score.completados);
  $('#ejercicios .score #ejerciciosTotal').text(options.cantidadOperaciones);

  const numericScore = score.aciertos / options.cantidadOperaciones * 10;
  $('#ejercicios #puntuacion').text(numericScore);
  showScoreBadges(numericScore);

  appendCorrections(score, exam);
  bindResultActions();

  $('#ejercicios').show();
  if (helpDrawer) {
    helpDrawer.refreshEvents();
  }
  console.timeEnd('resultados');
}
