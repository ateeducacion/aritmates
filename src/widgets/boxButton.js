import $ from 'jquery';
import '../../css/boxButton.scss';

export default class BoxButton {
  constructor() {
    // this.debug = true;
    const debug = false;
    const tag = '[boxButton.js.constructor]';
    if ( debug ) console.log( tag );
    this.selected = false;

    $('.boxButton').on('click', (ev) => {
      if ( debug ) {
        console.log( tag, 'picado box button',
            'ev.currentTarget.id', ev.currentTarget.id,
            'ev.target', ev.target );
      }
      this.triggerClick(ev.currentTarget);
    });
  }

  triggerClick( el ) {
    const debug = false;
    const tag = '[boxButton.js.triggerClick( el )]';
    if ( debug ) console.log( tag, el );
    if (el.getAttribute == undefined) {
      el = el[0];
    }

    if ( el.getAttribute('disabled')!==null ) {
      return;
    }

    $(el).toggleClass('selected');

    const postfix = '_mv';
    let hashid;
    // Selleciona los dos botones a la vez
    if ( el.id.includes(postfix) ) {
      const sinPostfix = el.id.replace(postfix, '');
      hashid = '#'+sinPostfix;
      $(document).trigger('selected:'+ sinPostfix, el.id );
    } else {
      hashid = '#'+el.id+'_mv';
      $(document).trigger('selected:'+ el.id, el.id);
    }
    $(hashid).toggleClass('selected');
  }
}

new BoxButton();
