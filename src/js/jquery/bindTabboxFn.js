import Tabbox from '../components/Tabbox'

export default function bindTabboxFn($) {

  $.fn.tabbox = function() {

    const tabboxes = this.map((i, dom) => new Tabbox(dom))

    this.destroy = () => tabboxes.each((i, t) => t.destroy())

    return this
  }
}
