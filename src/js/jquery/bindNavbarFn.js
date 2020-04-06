import Navbar from '../components/Navbar'

export default function bindNavbarFn($) {
  $.fn.navbar = function() {
    this.each((i, dom) => new Navbar(dom))
  }
}
