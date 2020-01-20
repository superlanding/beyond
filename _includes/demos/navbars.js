(function() {
  const { Navbar } = window.beyond
  const navbarDoms = Array.from(document.querySelectorAll('[data-navbar]'))

  navbarDoms.forEach(navbarDom => new Navbar(navbarDom))
})()
