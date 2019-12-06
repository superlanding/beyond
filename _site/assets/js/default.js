const { Codebox, Tabbox } = window.beyond

document.querySelectorAll('[data-codebox]').forEach(dom => {
  const codebox = new Codebox(dom)
})

document.querySelectorAll('[data-tabbox]').forEach(dom => {
  const tabbox = new Tabbox(dom)
})
