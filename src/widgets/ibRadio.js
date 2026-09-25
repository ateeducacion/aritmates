import $ from 'jquery';
import '../../css/ibRadio.css';

/**
 * Javascript radio button
 *
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @class IbRadio
 */
class IbRadio {
  constructor() {
    this.setEvents();
  }

  /**
   * Crea los eventos para que funcione el radio button
   *
   *
   * @author Fernando Ramírez Pérez
   * @memberof IbRadio
   */
  setEvents() {
    $('.ib-radio').on('click', (ev) => {
      const me = ev.currentTarget;
      let pair;
      const postfix = '_mv';
      const radioGroup = $(me).parent()[0].id;
      if ( radioGroup.includes(postfix) ) {
        const radioId = radioGroup.replace(postfix, '');
        pair = $('#'+ radioId + ' .ib-radio[data-val='+me.dataset.val+']')[0];
      } else {
        const radioIdMv = radioGroup + postfix;
        pair = $('#'+ radioIdMv + ' .ib-radio[data-val='+me.dataset.val+']')[0];
      }

      [me, pair].forEach( (el) => {
        if ( el ) {
          $(el).parent().find('.ib-radio').removeClass('selected');
          const val = el.dataset.val;
          $(el).parent()[0].dataset.value = val;
          $($(el).parent()[0]).trigger('change');
        }
      });
      [me, pair].forEach( (el) => {
        if (el) {
          $(el).toggleClass('selected');
        }
      });
    });

    // Para usarlo en otras sitios, ahora esto se gestiona en el obj options 
    // en app.js
    // $('.ib-radio-group').on('change', (ev) => {
    //   // si no viene de un event click mandamos el evento click:
  }
  unbindEvents() {
    $('.ib-radio').unbind('click');
  }
}

export default new IbRadio();
export const {ibRadio} = new IbRadio();
