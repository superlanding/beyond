const { Tabbox } = window.beyond

document.querySelectorAll('[data-tabbox]').forEach(dom => {
  const tabbox = new Tabbox(dom)
})
