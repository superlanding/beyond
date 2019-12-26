(function() {
  const { Codebox } = window.beyond

  document.querySelectorAll('[data-codebox]')
    .forEach(dom => {
      const codebox = new Codebox(dom)
    })
})()
