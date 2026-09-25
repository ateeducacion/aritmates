import $ from 'jquery';
import '../../css/boxButton.scss';

export default class BoxButton {
  constructor() {
    this.selected = false;

    $('.boxButton').on('click', (ev) => {
      this.triggerClick(ev.currentTarget);
    });
  }

  triggerClick( el ) {
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
