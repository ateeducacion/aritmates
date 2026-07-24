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
      // console.log('me', me.dataset.val, radioGroup );
      if ( radioGroup.includes(postfix) ) {
        // console.log( 'radioGroup', radioGroup );
        const radioId = radioGroup.replace(postfix, '');
        pair = $('#'+ radioId + ' .ib-radio[data-val='+me.dataset.val+']')[0];
        // console.log('tal', radioId, 'pair', pair );
      } else {
        const radioIdMv = radioGroup + postfix;
        pair = $('#'+ radioIdMv + ' .ib-radio[data-val='+me.dataset.val+']')[0];
        // console.log('cual', radioIdMv );
      }
      // console.log('mobil', pair);

      [me, pair].forEach( (el) => {
        // console.log('el', el);
        if ( el ) {
          $(el).parent().find('.ib-radio').removeClass('selected');
          // const name = $(el).parent().data('name');
          const val = el.dataset.val;
          // console.log('name val: ', name, val );
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
    //   const me = ev.currentTarget;
    //   const newValue = $(me).dataset.val;
    //   // si no viene de un event click mandamos el evento click:
    //   if ( ev.type !== 'click') {
    //     $(me).find('.ib-radio[data-val='+newValue+']').click();
    //   }
    // });
  }
  unbindEvents() {
    $('.ib-radio').unbind('click');
  }
}

export default new IbRadio();
export const {ibRadio} = new IbRadio();
