import Menu from '../components/Menu'

export default function bindMenuFn($) {
  $.fn.menu = function() {
    this.each((i, dom) => new Menu(dom))
    return this
  }
}
