import Tabbox from '../components/Tabbox'

export default function bindTabboxFn($) {
  $.fn.tabbox = function() {
    this.each((i, dom) => new Tabbox(dom))
  }
}
