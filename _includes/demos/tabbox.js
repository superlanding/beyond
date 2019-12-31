const { Tabbox } = window.beyond.default

document.querySelectorAll('[data-tabbox]').forEach(dom => {
  const tabbox = new Tabbox(dom)
})
