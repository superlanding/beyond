(function() {
  const { Alert } = window.beyond
  document.querySelectorAll('.alert')
    .forEach(dom => {
      new Alert(dom)
    })
})()
