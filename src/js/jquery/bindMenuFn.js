export default function bindMenuFn(beyond, $) {

  const { Menu } = beyond

  $.fn.menu = function() {

    const menus = this.map((i, dom) => new Menu(dom))

    this.destroy = () => menus.each((i, m) => m.destroy())

    return this
  }
}
