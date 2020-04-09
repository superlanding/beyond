import Menu from '../components/Menu'

export default function bindMenuFn($) {

  $.fn.menu = function() {

    const menus = this.map((i, dom) => new Menu(dom))

    this.destroy = () => menus.each((i, m) => m.destroy())

    return this
  }
}
