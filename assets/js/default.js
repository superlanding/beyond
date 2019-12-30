(function() {
  const { Codebox, Sidebar } = window.beyond

  document.querySelectorAll('[data-codebox]')
    .forEach(dom => {
      const codebox = new Codebox(dom)
    })
  const sidebar = new Sidebar(document.querySelector('[data-sidebar-opener]'))
})()
