import Sidebar from '../components/Sidebar'

export default function bindSidebarFn($) {

  $.fn.sidebar = function() {

    const sidebars = this.map((i, dom) => new Sidebar(dom))

    this.destroy = () => sidebars.each((i, s) => s.destroy())

    return this
  }
}
