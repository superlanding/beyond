import Sidebar from '../components/Sidebar'

export default function bindSidebarFn($) {
  $.fn.sidebar = function() {
    this.each((i, dom) => new Sidebar(dom))
    return this
  }
}
