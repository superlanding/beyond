(function() {
  const { Codebox, Modal, Tooltip } = window.beyond

  document.querySelectorAll('[data-codebox]')
    .forEach(dom => {
      const codebox = new Codebox(dom)
    })

  document.querySelectorAll('[data-tooltip]')
    .forEach(dom => {
      const tooltip = new Tooltip(dom)
    })
})()
