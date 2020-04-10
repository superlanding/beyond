export default function bindNavbarFn(beyond, $) {

  const { Navbar } = beyond

  $.fn.navbar = function() {

    const navbars = this.map((i, dom) => new Navbar(dom))

    this.destroy = () => navbars.each((i, n) => n.destroy())

    return this
  }
}
