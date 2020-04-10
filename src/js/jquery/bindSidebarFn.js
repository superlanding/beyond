export default function bindSidebarFn(beyond, $) {

  const { Sidebar } = beyond

  $.fn.sidebar = function() {

    const sidebars = this.map((i, dom) => new Sidebar(dom))

    this.destroy = () => sidebars.each((i, s) => s.destroy())

    return this
  }
}
