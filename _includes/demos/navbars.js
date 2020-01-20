(function() {
  const { Navbar } = window.beyond
  const navbarDoms = Array.from(document.querySelectorAll('[data-navbar]'))

  navbarDoms.forEach(navbarDom => {
    const navbar = new Navbar(navbarDom)
  })
})()
